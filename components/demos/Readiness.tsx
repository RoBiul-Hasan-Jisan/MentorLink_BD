'use client';
import { useDemo } from '@/lib/store';
import { EV, LV, ROLES, SK, compute, type EvKey, type RoleKey } from '@/lib/data';

export default function Readiness() {
  const { role, setRole, lv, setLevel, ev, setEvidence } = useDemo();
  const c = compute(role, lv, ev);
  const req = ROLES[role].req;
  const max = c.gaps.length ? c.gaps[0].pri : 1;
  return (
    <>
      <p className="intro">
        Pick a role, then set your level and the kind of evidence behind each skill. A self-rating is recorded but never counts as
        proof, so watch the two scores move apart.
      </p>
      <div className="seg" role="group" aria-label="Role">
        {(Object.keys(ROLES) as RoleKey[]).map((r) => (
          <button key={r} aria-pressed={role === r} onClick={() => setRole(r)}>{ROLES[r].name}</button>
        ))}
      </div>
      <div className="two">
        <div>
          {Object.keys(req).map((k) => (
            <div className="skill" key={k}>
              <div>
                {SK[k]}
                <small>needs {LV[req[k][1]]} · weight {req[k][0]}</small>
              </div>
              <select aria-label={SK[k] + ' level'} value={lv[k]} onChange={(e) => setLevel(k, +e.target.value)}>
                {LV.map((n, i) => <option key={n} value={i}>{n}</option>)}
              </select>
              <select aria-label={SK[k] + ' evidence'} value={ev[k]} onChange={(e) => setEvidence(k, e.target.value as EvKey)}>
                {(Object.keys(EV) as EvKey[]).map((v) => <option key={v} value={v}>{EV[v]}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="stack">
          <div>
            <div className="metric"><span>Readiness</span><b>{c.ready}%</b></div>
            <div className="bar"><i style={{ width: c.ready + '%' }} /></div>
            <p className="note" style={{ marginTop: 6 }}>100 × Σ(weight × min(level / required, 1)) / Σ(weight)</p>
          </div>
          <div>
            <div className="metric"><span>Proven readiness</span><b>{c.proven}%</b></div>
            <div className="bar ok"><i style={{ width: c.proven + '%' }} /></div>
            <p className="note" style={{ marginTop: 6 }}>Counts only quiz, project and endorsement evidence.</p>
          </div>
          <div>
            <div className="metric"><span>Confidence</span><b>{c.conf}%</b></div>
            <p className="note">Share of required skills backed by non-self evidence.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 10 }}>Biggest gaps</h3>
            <div className="gaps">
              {c.gaps.length === 0 && <p className="note">No gaps. Every required skill is at the level needed.</p>}
              {c.gaps.slice(0, 3).map((g) => (
                <div key={g.k}>
                  <div className="metric" style={{ fontSize: '.92rem' }}>
                    <span>{SK[g.k]}</span><span className="note">{LV[g.l]} to {LV[g.r]}</span>
                  </div>
                  <div className="bar"><i style={{ width: Math.round((100 * g.pri) / max) + '%' }} /></div>
                </div>
              ))}
            </div>
            <p className="note" style={{ marginTop: 8 }}>Ordered by weight × (required − level).</p>
          </div>
        </div>
      </div>
    </>
  );
}
