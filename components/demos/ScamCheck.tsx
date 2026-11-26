'use client';
import { useMemo, useState } from 'react';
import { PATTERNS, SCAM_SAMPLES } from '@/lib/data';

export default function ScamCheck() {
  const [text, setText] = useState(SCAM_SAMPLES.bad);
  const hits = useMemo(
    () =>
      PATTERNS.map(([re, key, desc]) => {
        const m = text.match(re);
        return m ? { key, desc, matched: m[0] } : null;
      }).filter((h): h is { key: string; desc: string; matched: string } => h !== null),
    [text],
  );
  return (
    <>
      <p className="intro">
        Every job post and chat message is checked for common scam signals. The check is plain pattern matching, so each flag has a
        reason. Flagged posts go to an admin and nothing is silently deleted. Edit the text or use a sample.
      </p>
      <div className="actions">
        <button className="btn sm" onClick={() => setText(SCAM_SAMPLES.good)}>Real-looking post</button>
        <button className="btn sm" onClick={() => setText(SCAM_SAMPLES.bad)}>Scam-looking post</button>
        <button className="btn sm" onClick={() => setText(SCAM_SAMPLES.bn)}>Bangla message</button>
      </div>
      <div className="two">
        <textarea id="scam-text" aria-label="Job post text" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="stack">
          {hits.length === 0 ? (
            <div className="verdict ok">No scam signals found. The post still goes to admin review before it is live.</div>
          ) : (
            <>
              <div className="verdict bad">
                {hits.length} signal{hits.length > 1 ? 's' : ''} found. Held for an admin. Nothing is deleted.
              </div>
              {hits.map((h) => (
                <div className="flag" key={h.key}>
                  <b>{h.key}</b>
                  <div>{h.desc}</div>
                  <div className="note">Matched: &ldquo;{h.matched}&rdquo;</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
