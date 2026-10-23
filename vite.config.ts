import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'yerbazo-live-marketing-proxy',
      configureServer(server) {
        // Proxy Google Sheets CSV
        server.middlewares.use('/api/sheet', (req, res) => {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const gid = urlObj.searchParams.get('gid') || '1278668720';
          const targetUrl = `https://docs.google.com/spreadsheets/d/15hjl5YFZqSFRGuh1IEv7zHDRXrQPPfvRU8dijVOmWPY/export?format=csv&gid=${gid}&t=${Date.now()}`;

          const fetchWithRedirect = (url: string) => {
            https.get(url, (proxyRes) => {
              if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
                fetchWithRedirect(proxyRes.headers.location);
                return;
              }
              res.setHeader('Content-Type', 'text/csv; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              proxyRes.pipe(res);
            }).on('error', (err) => {
              res.statusCode = 500;
              res.end(err.message);
            });
          };
          fetchWithRedirect(targetUrl);
        });

        // Proxy Firebase Live Store
        server.middlewares.use('/api/web-store', (_req, res) => {
          const targetUrl = `https://yerbazo-default-rtdb.firebaseio.com/store.json?t=${Date.now()}`;
          https.get(targetUrl, (proxyRes) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            proxyRes.pipe(res);
          }).on('error', (err) => {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          });
        });

        // Proxy Product Images for CORS-safe Canvas High-Res Export
        server.middlewares.use('/api/image-proxy', (req, res) => {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const imgUrl = urlObj.searchParams.get('url');
          if (!imgUrl || !imgUrl.startsWith('https://')) {
            res.statusCode = 400;
            res.end('Invalid URL');
            return;
          }
          https.get(imgUrl, (proxyRes) => {
            res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/webp');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            proxyRes.pipe(res);
          }).on('error', (err) => {
            res.statusCode = 500;
            res.end(err.message);
          });
        });
      }
    }
  ]
});
