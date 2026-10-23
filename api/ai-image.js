import { generateImage, friendlyError } from './_lib/ai.js';

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { prompt, aspect, referenceUrl, seed } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Falta prompt' });
    const out = await generateImage({ prompt, aspect, referenceUrl, seed });
    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ error: friendlyError(String(e.message)) });
  }
}
