import https from 'https';

export default function handler(req, res) {
  const imgUrl = req.query.url;
  if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.startsWith('https://')) {
    return res.status(400).send('Invalid image URL');
  }
  https.get(imgUrl, (proxyRes) => {
    res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/webp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    proxyRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send(err.message);
  });
}
