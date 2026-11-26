'use client';
import { useState } from 'react';
import { CRITERIA, DEFAULT_WEIGHTS, ENTRIES } from '@/lib/data';

export default function Arena() {
  const [w, setW] = useState<number[]>(DEFAULT_WEIGHTS);
  const [showUni, setShowUni] = useState(false);
  const total = w.reduce((a, b) => a + b, 0);
  const ok = total === 100;
  const rows = ENTRIES.map((e) => ({ ...e, score: e.s.reduce((a, s, i) => a + s * w[i], 0) / 10 })).sort((a, b) => b.score - a.score);
  return (
    <>
      <p className="intro">
        Entries are scored on one public rubric, and evaluators see a code instead of a name. Weights must add up to exactly 100 or
        results stay locked. Drag the weights and watch the ranking respond.
      </p>
      <div className="two">
        <div className="stack">
          {CRITERIA.map((n, i) => (
            <label className="w" key={n}>
              <span className="n">{n}</span>
              <input type="range" min={0} max={60} value={w[i]} aria-label={n + ' weight'}
                onChange={(e) => setW((cur) => cur.map((x, j) => (j === i ? +e.target.value : x)))} />
              <b>{w[i]}</b>
            </label>
          ))}
          <div className="metric">
            <span>Total weight</span>
            <b style={{ fontSize: '1.5rem', color: ok ? 'var(--ok)' : 'var(--bad)' }}>{total}</b>
          </div>
          <p className="note">Needs 2 to 8 criteria with whole-number weights that add up to exactly 100.</p>
        </div>
        <div className="stack">
          <div className="tw">
            <table>
              <thead>
                <tr><th>Rank</th><th>Entry</th>{showUni && <th>University</th>}<th>Score</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.code}>
                    <td>{ok ? i + 1 : 'Locked'}</td>
                    <td>{r.code}</td>
                    {showUni && <td>{r.uni}</td>}
                    <td>{ok ? r.score.toFixed(1) : 'n/a'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn sm" aria-pressed={showUni} onClick={() => setShowUni((s) => !s)}>
            {showUni ? 'Hide universities' : 'Show universities (evaluators never see this)'}
          </button>
          <p className="note">
            {ok
              ? 'Scores are computed on the server and locked once final. Showing universities never changes the order.'
              : 'Results stay locked until the rubric totals exactly 100.'}
          </p>
        </div>
      </div>
    </>
  );
}
