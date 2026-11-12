import { useState, useCallback } from 'react';
import { SITES, STAGES } from './data.js';
import { askMap } from './lib/ai.js';
import MapView from './components/MapView.jsx';
import Sidebar from './components/Sidebar.jsx';
import Panel from './components/Panel.jsx';

const ALL = () => new Set(STAGES.map((s) => s.k));

export default function App() {
  const [on, setOn] = useState(ALL);
  const [sel, setSel] = useState(null);
  const [hl, setHl] = useState(null);
  const [ai, setAi] = useState({ answer: '', source: '', loading: false });

  const vis = useCallback((s) => STAGES.reduce((n, { k }) => n + (on.has(k) ? s.v[k] : 0), 0), [on]);
  const toggle = (k) => setOn((p) => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const pick = (s) => setSel((p) => (p === s ? null : s));

  const onAsk = async (q) => {
    setAi((a) => ({ ...a, loading: true }));
    const r = await askMap(q, SITES);
    setOn(r.stages.length ? new Set(r.stages) : ALL());
    setHl(r.siteIds.length ? new Set(r.siteIds) : null);
    setAi({ answer: r.answer, source: r.source, loading: false });
  };
  const onClear = () => { setOn(ALL()); setHl(null); setAi({ answer: '', source: '', loading: false }); };

  return (
    <div className="app">
      <Sidebar sites={SITES} on={on} toggle={toggle} sel={sel} vis={vis} onPick={pick} ask={{ ...ai, onAsk, onClear }} />
      <main>
        <MapView sites={SITES} on={on} sel={sel} hl={hl} vis={vis} onPick={pick} />
        <Panel on={on} sel={sel} />
      </main>
    </div>
  );
}
