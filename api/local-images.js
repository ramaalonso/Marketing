import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const imgDir = path.join(process.cwd(), 'public', 'img');
  const items = [];

  const scanDir = (dirPath, folderLabel) => {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of files) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath, entry.name);
      } else if (/\.(webp|png|jpe?g|gif|svg)$/i.test(entry.name)) {
        const rel = path.relative(path.join(process.cwd(), 'public'), fullPath).replace(/\\/g, '/');
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
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ images: items });
  } catch (e) {
    res.status(200).json({ images: [] });
  }
}
