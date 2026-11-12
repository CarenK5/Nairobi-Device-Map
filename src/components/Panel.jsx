import { STAGES, TYPE, SITES } from '../data.js';
import { roadKm } from '../lib/geo.js';

export default function Panel({ on, sel }) {
  if (!on.size) return <section className="card"><h2>No stages selected</h2><p className="meta">Turn on at least one lifecycle stage to see devices on the map.</p></section>;
  if (!sel) return <section className="card"><h2>Pick a site</h2><p className="meta">Select a site on the map or in the list to see its devices and the route from the hub.</p></section>;
  const max = Math.max(...STAGES.map((s) => sel.v[s.k]), 1);
  const d = roadKm(SITES[0].p, sel.p), mins = Math.max(5, Math.round(((d / 22) * 60) / 5) * 5);
  return (
    <section className="card" aria-live="polite">
      <h2>{sel.n}</h2>
      <p className="meta">{sel.a}. {TYPE[sel.t]}.</p>
      {STAGES.map(({ k, n }) => (
        <div className="row" key={k} style={{ '--k': `var(--${k})` }}>
          <span>{n}</span><div className="bar"><span style={{ width: `${(sel.v[k] / max) * 100}%` }} /></div><b>{sel.v[k]}</b>
        </div>
      ))}
      {sel.id !== 'hub' && (
        <p className="eta"><b>{d.toFixed(1)} km</b> from the hub, about <b>{mins} min</b> by van.{' '}
          <span className="note">Estimate: straight-line distance plus 35% for roads, at 22 km/h average.</span></p>
      )}
    </section>
  );
}
