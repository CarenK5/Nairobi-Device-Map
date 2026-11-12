// Vercel serverless function. Keeps the API key off the client.
import { SITES } from '../src/data.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const q = req.body?.q;
  if (typeof q !== 'string' || !q.trim() || q.length > 300) return res.status(400).json({ error: 'Invalid question' });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(501).json({ error: 'No API key configured' });

  const data = SITES.map(({ id, n, a, t, v }) => ({ id, name: n, area: a, type: t, counts: v }));
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You answer questions about device sites in Nairobi using only this data: ${JSON.stringify(data)}. Counts keys: d=Deployed, r=In repair, f=Refurbished, c=Recycled. Reply with a JSON object only: {"stages":[keys that matter],"siteIds":[ids to highlight],"answer":"one or two plain sentences"}`,
        },
        { role: 'user', content: q },
      ],
    }),
  });
  if (!r.ok) return res.status(502).json({ error: 'Upstream error' });
  try {
    const j = await r.json();
    return res.json(JSON.parse(j.choices[0].message.content));
  } catch { return res.status(502).json({ error: 'Bad model reply' }); }
}
