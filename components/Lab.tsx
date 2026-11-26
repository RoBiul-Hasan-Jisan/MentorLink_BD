'use client';
import { useState } from 'react';
import Readiness from './demos/Readiness';
import MentorMatch from './demos/MentorMatch';
import ScamCheck from './demos/ScamCheck';
import Pipeline from './demos/Pipeline';
import Arena from './demos/Arena';
import Passport from './demos/Passport';

const TABS = [
  { id: 'ready', label: 'Readiness', C: Readiness },
  { id: 'match', label: 'Mentor match', C: MentorMatch },
  { id: 'scam', label: 'Scam check', C: ScamCheck },
  { id: 'hire', label: 'Hiring pipeline', C: Pipeline },
  { id: 'arena', label: 'Proof Arena', C: Arena },
  { id: 'pass', label: 'Career Passport', C: Passport },
];

export default function Lab() {
  const [active, setActive] = useState('ready');
  return (
    <section className="block" id="demo">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Live demos</p>
          <h2>Try the real rules</h2>
          <p>These run in your browser with sample data. The formulas and rules are the ones the server enforces. No account needed.</p>
        </div>
        <div className="lab">
          <div className="tabs" role="tablist" aria-label="Demos">
            {TABS.map((t) => (
              <button key={t.id} role="tab" id={'t-' + t.id} aria-selected={active === t.id} aria-controls={'p-' + t.id} onClick={() => setActive(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          {TABS.map(({ id, C }) => (
            <div key={id} id={'p-' + id} role="tabpanel" aria-labelledby={'t-' + id} hidden={active !== id} className="panel">
              {active === id && <C />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
