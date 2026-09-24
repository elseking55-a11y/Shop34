import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const TOKEN_KEY = 'shop34_customer_token';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const actual = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return crypto.timingSafeEqual(
    Buffer.from(actual, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );
}

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: 'customer',
    joinDate: row.created_at,
  };
}

export async function initCustomerAuth(pool) {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export function registerCustomerAuth(app, pool) {
  const requireCustomer = (req, res, next) => {
    if (!pool) return res.status(503).json({ error: 'DATABASE_URL is not configured.' });

    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

    try {
      req.customer = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      return res.status(401).json({ error: 'Customer authentication required.' });
    }
  };

  app.post('/api/auth/signup', async (req, res) => {
    if (!pool) return res.status(503).json({ error: 'DATABASE_URL is not configured.' });
    if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'JWT_SECRET is not configured.' });

    const name = String(req.body?.name || '').trim();
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');

    if (name.length < 2) return res.status(400).json({ error: 'Enter your full name.' });
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    const existing = await pool.query('SELECT id FROM customers WHERE email=$1', [email]);
    if (existing.rows[0]) return res.status(409).json({ error: 'An account with this email already exists.' });

    const id = 'CUS-' + crypto.randomUUID();
    const { salt, hash } = hashPassword(password);

    const { rows } = await pool.query(
      'INSERT INTO customers (id,name,email,password_hash,password_salt) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,created_at',
      [id, name, email, hash, salt]
    );

    const user = publicUser(rows[0]);
    const token = jwt.sign({ role: 'customer', id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token, user });
  });

  app.post('/api/auth/signin', async (req, res) => {
    if (!pool) return res.status(503).json({ error: 'DATABASE_URL is not configured.' });
    if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'JWT_SECRET is not configured.' });

    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');

    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const { rows } = await pool.query('SELECT * FROM customers WHERE email=$1', [email]);
    const customer = rows[0];

    if (!customer || !verifyPassword(password, customer.password_salt, customer.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = publicUser(customer);
    const token = jwt.sign({ role: 'customer', id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user });
  });

  app.get('/api/auth/me', requireCustomer, async (req, res) => {
    const { rows } = await pool.query(
      'SELECT id,name,email,created_at FROM customers WHERE id=$1',
      [req.customer.id]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Customer account not found.' });

    res.json({ user: publicUser(rows[0]) });
  });
}
