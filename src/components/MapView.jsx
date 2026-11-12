import { STAGES, ROADS } from '../data.js';
import { project } from '../lib/geo.js';

const pts = (a) => a.map((p) => project(p).join(' ')).join('L');

export default function MapView({ sites, on, sel, hl, vis, onPick }) {
  const hub = sites[0];
  const route = (() => {
    if (!sel || sel.id === 'hub') return null;
    const a = project(hub.p), b = project(sel.p);
    return `M${a}Q${[(a[0] + b[0]) / 2 - (b[1] - a[1]) * 0.12, (a[1] + b[1]) / 2 + (b[0] - a[0]) * 0.12]} ${b}`;
  })();
  const park = [[-1.325, 36.8], [-1.325, 36.86], [-1.36, 36.89], [-1.395, 36.86], [-1.395, 36.8]].map((p) => project(p).join(',')).join(' ');
  const [px, py] = project([-1.36, 36.83]);
  return (
    <svg className="map" viewBox="0 0 800 700" role="group" aria-label="Schematic map of Nairobi with device sites">
      <polygon points={park} fill="var(--park)" />
      <text x={px} y={py} textAnchor="middle">Nairobi National Park</text>
      {ROADS.map(([name, line, lp]) => {
        const [lx, ly] = project(lp);
        return (
          <g key={name}>
            <path d={'M' + pts(line)} fill="none" stroke="var(--rl)" strokeWidth="9" strokeLinecap="round" />
            <path d={'M' + pts(line)} fill="none" stroke="var(--road)" strokeWidth="6" strokeLinecap="round" />
            <text x={lx} y={ly} className="rd">{name}</text>
          </g>
        );
      })}
      {route && <path d={route} className="route" />}
      {sites.map((s) => {
        const tot = vis(s);
        if (!tot) return null;
        const [x, y] = project(s.p), r = 14 + Math.min(16, Math.sqrt(tot) * 1.1), C = 2 * Math.PI * r;
        let off = 0;
        const arcs = STAGES.filter((st) => on.has(st.k) && s.v[st.k]).map((st) => {
          const L = (s.v[st.k] / tot) * C, a = { k: st.k, L, off };
          off += L;
          return a;
        });
        const act = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(s); } };
        return (
          <g key={s.id} className="site" transform={`translate(${x} ${y})`} tabIndex={0} role="button"
            aria-label={`${s.n}, ${s.a}, ${tot} devices`} opacity={hl && !hl.has(s.id) ? 0.25 : 1}
            onClick={() => onPick(s)} onKeyDown={act}>
            {s.t !== 'cl' && <circle r={r + 8} fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray={s.t === 'rec' ? '2 4' : 'none'} />}
            {sel === s && <circle r={r + 13} fill="none" stroke="var(--ink)" strokeWidth="3" />}
            {arcs.map((a) => (
              <circle key={a.k} r={r} fill="none" strokeWidth="8" stroke={`var(--${a.k})`}
                strokeDasharray={`${a.L} ${C - a.L}`} strokeDashoffset={-a.off} transform="rotate(-90)" />
            ))}
            <circle r={r - 4.5} fill="var(--panel)" />
            <text textAnchor="middle" y="4" style={{ stroke: 'none', fontWeight: 600 }}>{tot}</text>
            <text x={r + (s.t === 'cl' ? 8 : 14)} y="4">{s.n}</text>
          </g>
        );
      })}
    </svg>
  );
}
