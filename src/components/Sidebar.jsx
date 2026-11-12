import { STAGES } from '../data.js';
import AskBar from './AskBar.jsx';

export default function Sidebar({ sites, on, toggle, sel, vis, onPick, ask }) {
  return (
    <aside>
      <div>
        <h1>Nairobi device map</h1>
        <p className="sub">Where every device is in its lifecycle, from client desk to recycling.</p>
      </div>
      <div className="chips" role="group" aria-label="Lifecycle stages">
        {STAGES.map(({ k, n }) => (
          <button key={k} className="chip" style={{ '--k': `var(--${k})` }} aria-pressed={on.has(k)} onClick={() => toggle(k)}>
            <i />{n}<b>{sites.reduce((a, s) => a + s.v[k], 0)}</b>
          </button>
        ))}
      </div>
      <AskBar {...ask} />
      <ul className="list">
        {[...sites].sort((a, b) => vis(b) - vis(a)).map((s) => (
          <li key={s.id}>
            <button aria-current={sel === s || undefined} onClick={() => onPick(s)}>
              <span>{s.n}<br /><small>{s.a}</small></span><b>{vis(s)}</b>
            </button>
          </li>
        ))}
      </ul>
      <p className="note">Sample data. Positions are approximate and the map is schematic.</p>
    </aside>
  );
}
