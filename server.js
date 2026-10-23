import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env (API keys solo del lado servidor)
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
} catch {}

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Endpoints de IA (mismos handlers que usa Vercel)
const aiRoutes = ['ai-strategy', 'ai-image', 'ai-voice', 'ai-copy'];
for (const name of aiRoutes) {
  app.post(`/api/${name}`, async (req, res) => {
    const mod = await import(`./api/${name}.js`);
    return mod.default(req, res);
  });
}

// Google Sheets live CSV proxy
app.get('/api/sheet', (req, res) => {
  const gid = req.query.gid || '1278668720';
  const targetUrl = `https://docs.google.com/spreadsheets/d/15hjl5YFZqSFRGuh1IEv7zHDRXrQPPfvRU8dijVOmWPY/export?format=csv&gid=${gid}&t=${Date.now()}`;

  const fetchWithRedirect = (url) => {
    https.get(url, { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }, (proxyRes) => {
      if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        fetchWithRedirect(proxyRes.headers.location);
        return;
      }
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      proxyRes.pipe(res);
    }).on('error', (err) => {
      res.status(500).send(err.message);
    });
  };

  fetchWithRedirect(targetUrl);
});

// Yerbazo live web store proxy (Firebase RTDB)
app.get('/api/web-store', (req, res) => {
  const targetUrl = `https://yerbazo-default-rtdb.firebaseio.com/store.json?t=${Date.now()}`;
  https.get(targetUrl, (proxyRes) => {
    let raw = '';
    proxyRes.on('data', chunk => { raw += chunk; });
    proxyRes.on('end', () => {
      try {
        const data = JSON.parse(raw);
        if (!data.coupons) data.coupons = [];
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
      } catch (e) {
        res.status(500).json({ error: 'Failed parsing store data' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

// Image proxy for CORS-free High-Resolution Canvas exports (PNG & Video)
app.get('/api/image-proxy', (req, res) => {
  const imgUrl = req.query.url;
  if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.startsWith('https://')) {
    return res.status(400).send('Invalid URL');
  }
  https.get(imgUrl, (proxyRes) => {
    res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/webp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    proxyRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send(err.message);
  });
});

// Auto-scanner for /public/img folder (GitHub continuous photo uploads)
app.get('/api/local-images', (req, res) => {
  const imgDir = path.join(__dirname, 'public', 'img');
  const items = [];
  const scanDir = (dirPath, folderLabel) => {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of files) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath, entry.name);
      } else if (/\.(webp|png|jpe?g|gif|svg)$/i.test(entry.name)) {
        const rel = path.relative(path.join(__dirname, 'public'), fullPath).replace(/\\/g, '/');
        items.push({
          name: entry.name,
          url: `/${rel}`,
          folder: folderLabel || 'root'
        });
      }
    }
  };
  try {
    scanDir(imgDir, 'root');
    res.json({ images: items });
  } catch {
    res.json({ images: [] });
  }
});

// Serve /img directly from public/img so new photos appear without rebuilding
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Yerbazo Holo IA Studio corriendo en http://localhost:${PORT}`);
});
