import { generateVoice, friendlyError } from './_lib/ai.js';

export const config = { maxDuration: 120 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { text, voice } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Falta texto' });
    const result = await generateVoice({ text, voice });
    res.setHeader('Content-Type', result.contentType || 'audio/wav');
    res.setHeader('X-Voice-Engine', result.engine || 'gemini-tts');
    res.status(200).send(result.buffer);
  } catch (e) {
    res.status(500).json({ error: friendlyError(String(e.message)) });
  }
}
