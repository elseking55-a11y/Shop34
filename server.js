import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 10000);

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    })
  : null;

app.use(cors({ origin: true }));
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
}));

const requireDb = (_req, res, next) => {
  if (!pool) {
    return res.status(503).json({ error: 'DATABASE_URL is not configured.' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }
};

async function initDb() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
      category TEXT NOT NULL DEFAULT 'General',
      image_url TEXT NOT NULL DEFAULT '',
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      video_url TEXT,
      rating NUMERIC(3,2) NOT NULL DEFAULT 0,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      featured BOOLEAN NOT NULL DEFAULT false,
      status TEXT NOT NULL DEFAULT 'available',
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      offer_label TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      total NUMERIC(12,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_reference TEXT UNIQUE,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      delivery_method TEXT,
      whatsapp_number TEXT
    )
  `);
}

function mapProduct(p) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    imageUrl: p.image_url,
    images: p.images || [],
    videoUrl: p.video_url,
    rating: Number(p.rating),
    reviewsCount: p.reviews_count,
    likes: p.likes,
    views: p.views,
    featured: p.featured,
    status: p.status,
    stock: p.stock,
    offerLabel: p.offer_label,
  };
}

app.get('/health', async (_req, res) => {
  let database = false;
  if (pool) {
    try {
      await pool.query('SELECT 1');
      database = true;
    } catch {}
  }

  res.json({
    status: 'ok',
    database,
    paymentsConfigured: Boolean(process.env.PAYSTACK_SECRET_KEY),
    adminConfigured: Boolean(
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      process.env.JWT_SECRET
    ),
  });
});

app.post('/api/admin/login', (req, res) => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(503).json({
      error: 'Admin authentication is not configured.',
    });
  }

  if (
    req.body?.email !== ADMIN_EMAIL ||
    req.body?.password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  res.json({
    token: jwt.sign(
      { role: 'admin', email: ADMIN_EMAIL },
      JWT_SECRET,
      { expiresIn: '12h' }
    ),
  });
});

app.get('/api/site-settings', requireDb, async (_req, res) => {
  const { rows } = await pool.query('SELECT data FROM site_settings WHERE id=1');
  res.json(rows[0]?.data || {});
});

app.put('/api/site-settings', requireDb, requireAdmin, async (req, res) => {
  const data = req.body || {};
  await pool.query(
    `INSERT INTO site_settings (id,data,updated_at)
     VALUES (1,$1,NOW())
     ON CONFLICT (id) DO UPDATE SET data=$1, updated_at=NOW()`,
    [JSON.stringify(data)]
  );
  res.json(data);
});

app.get('/api/products', requireDb, async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT
      id, name, description, price, category,
      image_url AS "imageUrl",
      images,
      video_url AS "videoUrl",
      rating,
      reviews_count AS "reviewsCount",
      likes, views, featured, status, stock,
      offer_label AS "offerLabel"
    FROM products
    WHERE status <> 'hidden'
    ORDER BY featured DESC, name ASC
  `);

  res.json(rows);
});

app.post('/api/products', requireDb, requireAdmin, async (req, res) => {
  const p = req.body || {};
  const id = p.id || crypto.randomUUID();

  const { rows } = await pool.query(`
    INSERT INTO products (
      id, name, description, price, category, image_url, images,
      video_url, rating, reviews_count, likes, views, featured,
      status, stock, offer_label
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
    )
    RETURNING *
  `, [
    id,
    p.name,
    p.description || '',
    p.price,
    p.category || 'General',
    p.imageUrl || '',
    JSON.stringify(p.images || []),
    p.videoUrl || null,
    p.rating || 0,
    p.reviewsCount || 0,
    p.likes || 0,
    p.views || 0,
    Boolean(p.featured),
    p.status || 'available',
    p.stock || 0,
    p.offerLabel || null,
  ]);

  res.status(201).json(mapProduct(rows[0]));
});

app.put('/api/products/:id', requireDb, requireAdmin, async (req, res) => {
  const p = req.body || {};

  const { rows } = await pool.query(`
    UPDATE products SET
      name=$2,
      description=$3,
      price=$4,
      category=$5,
      image_url=$6,
      images=$7,
      video_url=$8,
      rating=$9,
      reviews_count=$10,
      likes=$11,
      views=$12,
      featured=$13,
      status=$14,
      stock=$15,
      offer_label=$16
    WHERE id=$1
    RETURNING *
  `, [
    req.params.id,
    p.name,
    p.description || '',
    p.price,
    p.category || 'General',
    p.imageUrl || '',
    JSON.stringify(p.images || []),
    p.videoUrl || null,
    p.rating || 0,
    p.reviewsCount || 0,
    p.likes || 0,
    p.views || 0,
    Boolean(p.featured),
    p.status || 'available',
    p.stock || 0,
    p.offerLabel || null,
  ]);

  if (!rows[0]) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  res.json(mapProduct(rows[0]));
});

app.delete('/api/products/:id', requireDb, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
  res.status(204).end();
});

app.get('/api/customers', requireDb, requireAdmin, async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id,name,email,created_at AS "joinDate" FROM customers ORDER BY created_at DESC'
  );
  res.json(rows.map((u) => ({ ...u, role: 'customer' })));
});

app.get('/api/orders/lookup', requireDb, async (req, res) => {
  const reference = String(req.query.reference || '').trim();
  const email = String(req.query.email || '').trim().toLowerCase();

  if (!reference || !email) {
    return res.status(400).json({
      error: 'Order ID and email are required.',
    });
  }

  const { rows } = await pool.query(`
    SELECT
      id,
      customer_name AS "customerName",
      email,
      total,
      status,
      payment_status AS "paymentStatus",
      date,
      items
    FROM orders
    WHERE id=$1 AND LOWER(email)=LOWER($2)
  `, [reference, email]);

  if (!rows[0]) {
    return res.status(404).json({
      error: 'Order not found for that email.',
    });
  }

  res.json({
    ...rows[0],
    total: Number(rows[0].total),
  });
});

app.get('/api/orders', requireDb, requireAdmin, async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT
      id,
      customer_name AS "customerName",
      email,
      total,
      status,
      payment_status AS "paymentStatus",
      payment_reference AS "paymentReference",
      date,
      items,
      delivery_method AS "deliveryMethod",
      whatsapp_number AS "whatsappNumber"
    FROM orders
    ORDER BY date DESC
  `);

  res.json(rows.map((o) => ({
    ...o,
    total: Number(o.total),
  })));
});

app.patch('/api/orders/:id/status', requireDb, requireAdmin, async (req, res) => {
  const allowed = [
    'pending',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
  ];

  if (!allowed.includes(req.body?.status)) {
    return res.status(400).json({ error: 'Invalid order status.' });
  }

  const { rows } = await pool.query(
    'UPDATE orders SET status=$2 WHERE id=$1 RETURNING id,status',
    [req.params.id, req.body.status]
  );

  if (!rows[0]) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  res.json(rows[0]);
});

app.delete('/api/orders/:id', requireDb, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM orders WHERE id=$1', [req.params.id]);
  res.status(204).end();
});

app.post('/api/payments/initialize', requireDb, async (req, res) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return res.status(503).json({
      error: 'PAYSTACK_SECRET_KEY is not configured.',
    });
  }

  const {
    name,
    email,
    address,
    phone,
    deliveryMethod,
    whatsappNumber,
    items,
  } = req.body || {};

  if (
    !name ||
    !email ||
    !address ||
    !Array.isArray(items) ||
    !items.length
  ) {
    return res.status(400).json({
      error: 'Complete customer and cart details are required.',
    });
  }

  const ids = items.map((i) => i.productId);
  const { rows: products } = await pool.query(
    'SELECT id,name,price,stock FROM products WHERE id = ANY($1::text[])',
    [ids]
  );

  const byId = new Map(products.map((p) => [p.id, p]));
  const normalized = [];
  let total = 0;

  for (const item of items) {
    const p = byId.get(item.productId);
    const qty = Number(item.quantity);

    if (!p || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'Invalid cart item.' });
    }

    if (p.stock < qty) {
      return res.status(409).json({
        error: p.name + ' has insufficient stock.',
      });
    }

    normalized.push({
      productId: p.id,
      name: p.name,
      quantity: qty,
      unitPrice: Number(p.price),
    });

    total += Number(p.price) * qty;
  }

  const orderId =
    'ORD-' + crypto.randomUUID().slice(0, 8).toUpperCase();
  const reference =
    'SHOP34-' + crypto.randomUUID().replace(/-/g, '');

  const base = process.env.PUBLIC_APP_URL || process.env.APP_URL;
  if (!base) {
    return res.status(503).json({
      error: 'PUBLIC_APP_URL is not configured.',
    });
  }

  await pool.query(
    `INSERT INTO orders (
      id, customer_name, email, address, phone, total,
      status, payment_status, payment_reference, items,
      delivery_method, whatsapp_number
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      orderId,
      name,
      email,
      address,
      phone || null,
      total,
      'pending',
      'pending',
      reference,
      JSON.stringify(normalized),
      deliveryMethod || null,
      whatsappNumber || null,
    ]
  );

  try {
    const paystack = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(total * 100),
          currency: process.env.PAYSTACK_CURRENCY || 'KES',
          reference,
          callback_url:
            base.replace(/\/$/, '') +
            '/payment/callback?reference=' +
            encodeURIComponent(reference),
          metadata: { order_id: orderId },
        }),
      }
    );

    const result = await paystack.json();

    if (!paystack.ok || !result.status) {
      await pool.query(
        'DELETE FROM orders WHERE id=$1',
        [orderId]
      );

      return res.status(502).json({
        error:
          result.message ||
          'Unable to initialize payment.',
      });
    }

    res.json({
      orderId,
      reference,
      authorizationUrl: result.data.authorization_url,
    });
  } catch (error) {
    await pool.query('DELETE FROM orders WHERE id=$1', [orderId]);
    console.error('Paystack initialization error:', error);
    return res.status(502).json({
      error: 'Unable to connect to the payment provider.',
    });
  }
});

async function finalizePayment(reference, data) {
  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE payment_reference=$1',
    [reference]
  );

  if (!rows[0] || rows[0].payment_status === 'paid') return;

  const order = rows[0];

  if (data.status !== 'success') {
    await pool.query(
      'UPDATE orders SET payment_status=$2 WHERE id=$1',
      [order.id, 'failed']
    );
    return;
  }

  const expected = Math.round(Number(order.total) * 100);

  if (
    Number(data.amount) !== expected ||
    data.currency !== (process.env.PAYSTACK_CURRENCY || 'KES')
  ) {
    await pool.query(
      'UPDATE orders SET payment_status=$2 WHERE id=$1',
      [order.id, 'failed']
    );
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const item of order.items || []) {
      const stock = await client.query(
        'UPDATE products SET stock=stock-$1 WHERE id=$2 AND stock >= $1 RETURNING id',
        [item.quantity, item.productId]
      );

      if (!stock.rows[0]) {
        throw new Error(
          'Stock changed before payment was finalized.'
        );
      }
    }

    await client.query(
      'UPDATE orders SET payment_status=$2,status=$3 WHERE id=$1',
      [order.id, 'paid', 'processing']
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.get('/api/payments/verify/:reference', requireDb, async (req, res) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return res.status(503).json({
      error: 'PAYSTACK_SECRET_KEY is not configured.',
    });
  }

  const response = await fetch(
    'https://api.paystack.co/transaction/verify/' +
      encodeURIComponent(req.params.reference),
    {
      headers: {
        Authorization:
          'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
      },
    }
  );

  const result = await response.json();

  if (!response.ok || !result.status) {
    return res.status(502).json({
      error:
        result.message || 'Payment verification failed.',
    });
  }

  try {
    await finalizePayment(
      req.params.reference,
      result.data
    );
  } catch (error) {
    console.error('Payment finalization error:', error);
    return res.status(409).json({
      error: 'Payment succeeded but stock could not be finalized.',
    });
  }

  res.json({
    status: result.data.status,
    reference: req.params.reference,
  });
});

app.post('/api/payments/webhook', async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) return res.sendStatus(200);

  const signature = String(
    req.headers['x-paystack-signature'] || ''
  );

  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.rawBody || '')
    .digest('hex');

  if (
    !signature ||
    signature.length !== hash.length ||
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(hash)
    )
  ) {
    return res.sendStatus(401);
  }

  res.sendStatus(200);

  if (
    req.body?.event === 'charge.success' &&
    req.body.data?.reference
  ) {
    try {
      await finalizePayment(
        req.body.data.reference,
        req.body.data
      );
    } catch (error) {
      console.error('Webhook payment finalization error:', error);
    }
  }
});

initDb()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log('Shop34 API listening on ' + port);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
