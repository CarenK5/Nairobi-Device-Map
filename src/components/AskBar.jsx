import { useState } from 'react';

export default function AskBar({ onAsk, answer, source, loading, onClear }) {
  const [q, setQ] = useState('');
  const submit = (e) => { e.preventDefault(); if (q.trim()) onAsk(q.trim()); };
  return (
    <div className="ask">
      <form onSubmit={submit}>
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask about the devices"
          placeholder="Which sites have the most devices in repair?" maxLength={300} />
        <button disabled={loading}>{loading ? '…' : 'Ask'}</button>
      </form>
      <div aria-live="polite">
        {answer && <>
          <p>{answer}</p>
          <p className="src">{source === 'ai' ? 'Answered by an AI model.' : 'Answered by the built-in parser (no AI key set).'}{' '}
            <button type="button" className="clr" onClick={() => { setQ(''); onClear(); }}>Clear</button></p>
        </>}
      </div>
    </div>
  );
}
