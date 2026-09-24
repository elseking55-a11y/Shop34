import express from 'express';
import pg from 'pg';
import { registerCustomerAuth, initCustomerAuth } from './customer-auth.js';

const publicPort = Number(process.env.PORT || 10000);
const internalPort = publicPort + 1;
process.env.PORT = String(internalPort);

await import('./server.js');

const { Pool } = pg;
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    })
  : null;

await initCustomerAuth(pool);

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(corsMiddleware);

function corsMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}

registerCustomerAuth(app, pool);

app.use(async (req, res) => {
  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : JSON.stringify(req.body ?? {});

  try {
    const response = await fetch(
      'http://127.0.0.1:' + internalPort + req.originalUrl,
      {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          Authorization: req.headers.authorization || '',
        },
        body,
      }
    );

    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (!['content-length', 'transfer-encoding', 'connection'].includes(key)) {
        res.setHeader(key, value);
      }
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error('Internal API proxy error:', error);
    res.status(502).json({ error: 'Backend service is starting. Please retry.' });
  }
});

app.listen(publicPort, '0.0.0.0', () => {
  console.log('Shop34 public API listening on ' + publicPort);
});
