'use client';
import { useDemo } from '@/lib/store';
import { LANGS, ROLES, SLOTS, matchMentors } from '@/lib/data';

export default function MentorMatch() {
  const { role, lv, ev, langs, toggleLang, slots, toggleSlot } = useDemo();
  const results = matchMentors(role, lv, ev, langs, slots);
  return (
    <>
      <p className="intro">
        Mentors are ranked on your gaps from the Readiness demo (<b>{ROLES[role].name}</b>), plus your languages and weekly slots.
        Each factor shows its points, so you can see why a mentor ranks where they do.
      </p>
      <div className="two">
        <div className="stack">
          <b>Languages you speak</b>
          <div className="chips">
            {Object.keys(LANGS).map((k) => (
              <button key={k} className={k === 'bn' ? 'bn' : ''} aria-pressed={!!langs[k]} onClick={() => toggleLang(k)}>{LANGS[k]}</button>
            ))}
          </div>
        </div>
        <div className="stack">
          <b>Slots you are free</b>
          <div className="chips">
            {Object.keys(SLOTS).map((k) => (
              <button key={k} aria-pressed={!!slots[k]} onClick={() => toggleSlot(k)}>{SLOTS[k]}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="stack">
        {results.map((r, i) => (
          <div className={'mentor' + (i === 0 ? ' top' : '')} key={r.m.n}>
            <div className="mentor-head">
              <div><b>{r.m.n}</b><span className="note">{r.m.r}</span></div>
              <div className="score">{Math.round(r.total)} <small>/ 100</small></div>
            </div>
            <div className="factors">
              {r.factors.map((f) => (
                <div className="factor" key={f.label}>
                  <div className="row"><span>{f.label}</span><span>{(f.v * f.max).toFixed(1)} / {f.max}</span></div>
                  <div className="bar"><i style={{ width: Math.round(f.v * 100) + '%' }} /></div>
                  <span className="why">{f.why}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="note">
        Weights: career fit 30, gap coverage 25, experience 15, language 10, schedule 10, reliability 10. University, name and gender
        are never used. Mentors shown are sample profiles.
      </p>
    </>
  );
}
