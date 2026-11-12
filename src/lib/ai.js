import { STAGES } from '../data.js';
const KEY = { r: /repair|broken|fault/i, f: /refurb|ready|stock/i, d: /deploy|install|in use/i, c: /recycl|e-?waste|dispos/i };

// Offline fallback so the demo works without an API key
function localAsk(q, sites) {
  const lq = q.toLowerCase();
  const stages = STAGES.filter((s) => KEY[s.k].test(q)).map((s) => s.k);
  const use = stages.length ? stages : STAGES.map((s) => s.k);
  const score = (s) => use.reduce((n, k) => n + s.v[k], 0);
  const named = sites.filter((s) => lq.includes(s.a.toLowerCase()) || lq.includes(s.n.toLowerCase()));
  const pool = named.length ? named : sites.filter((s) => s.t === 'cl');
  const top = /most|top|highest|biggest/i.test(q) ? [...pool].sort((a, b) => score(b) - score(a)).slice(0, 3) : pool.filter((s) => score(s) > 0);
  const label = use.map((k) => STAGES.find((s) => s.k === k).n.toLowerCase()).join(' + ');
  return {
    stages: use, siteIds: top.map((s) => s.id), source: 'local',
    answer: top.length ? `${top.map((s) => `${s.n} (${score(s)})`).join(', ')}: ${label} devices.` : 'No matching sites. Try naming a stage or an area.',
  };
}

// Ask the serverless function (LLM) first, then fall back to the local parser
export async function askMap(q, sites) {
  try {
    const r = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q }) });
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j.stages) && Array.isArray(j.siteIds) && typeof j.answer === 'string') return { ...j, source: 'ai' };
    }
  } catch { /* offline or no backend */ }
  return localAsk(q, sites);
}
