'use client';
import { useState } from 'react';
import { PASSPORT_SECTIONS } from '@/lib/data';

function newSlug() {
  const c = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

export default function Passport() {
  const [on, setOn] = useState(false);
  const [sec, setSec] = useState<Record<string, boolean>>({ skills: true, projects: true, sprints: true });
  const [slug, setSlug] = useState('k8m2qx');
  const keys = Object.keys(PASSPORT_SECTIONS);
  const shown = keys.filter((k) => sec[k]);
  const strength = 20 + shown.length * 12;
  return (
    <>
      <p className="intro">
        The Career Passport is a proof profile the student owns. Sharing is off until switched on, and the student picks which sections
        the public link shows. No email, phone or address is ever included.
      </p>
      <div className="two">
        <div className="stack">
          <label className="check"><input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> Sharing on</label>
          <div className="chips">
            {keys.map((k) => (
              <button key={k} aria-pressed={!!sec[k]} onClick={() => setSec((s) => ({ ...s, [k]: !s[k] }))}>{PASSPORT_SECTIONS[k][0]}</button>
            ))}
          </div>
          <div><button className="btn sm" onClick={() => setSlug(newSlug())}>New link</button></div>
          <p className="note">&ldquo;New link&rdquo; stops the old link working. Only verified students can share.</p>
        </div>
        <div className="passport">
          {!on ? (
            <>
              <b className="t">Private</b>
              <p className="note">Nobody can open this passport. Turn sharing on to get a link.</p>
            </>
          ) : (
            <>
              <div className="metric"><b className="t">Robiul K.</b><span className="chip ok">Proof strength {strength}</span></div>
              <p className="note">mentorlink.example/p/{slug} · hidden from search engines</p>
              {shown.map((k) => (
                <div key={k}><b>{PASSPORT_SECTIONS[k][0]}</b><div className="note">{PASSPORT_SECTIONS[k][1]}</div></div>
              ))}
              {shown.length === 0 && <p className="note">No sections are public yet.</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
