import { researchCompetition, buildStrategy } from './_lib/ai.js';

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { products = [], days = 14, goal = '', focus = '', startDate } = req.body || {};
  let research = { report: '', sources: [] };
  try {
    research = await researchCompetition(focus || goal);
  } catch (e) {
    research.error = String(e.message);
  }
  try {
    const plan = await buildStrategy({
      products,
      research: research.report,
      days,
      goal,
      startDate: startDate || new Date().toISOString().slice(0, 10)
    });
    res.status(200).json({ ...plan, research });
  } catch (e) {
    res.status(500).json({ error: String(e.message), research });
  }
}
