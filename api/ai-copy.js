import { generateCopy } from './_lib/ai.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    res.status(200).json(await generateCopy(req.body || {}));
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
}
