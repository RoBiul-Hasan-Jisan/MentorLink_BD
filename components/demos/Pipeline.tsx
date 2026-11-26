'use client';
import { useState } from 'react';
import { NEXT, STAGE_ORDER, uiStage } from '@/lib/data';

const EMP_ACTIONS: [string, string][] = [
  ['Under Review', 'Start review'],
  ['Shortlisted', 'Shortlist'],
  ['Interview', 'Schedule interview'],
  ['Offer', 'Send offer'],
  ['Rejected', 'Reject'],
];

export default function Pipeline() {
  const [stage, setStage] = useState('Applied');
  const [log, setLog] = useState(['Application sent by the student.']);
  const move = (to: string, who: string) => {
    setStage(to);
    setLog((l) => [`${who} moved it to ${to}.`, ...l].slice(0, 6));
  };
  const rejectedOrWithdrawn = stage === 'Rejected' || stage === 'Withdrawn';
  const curIdx = STAGE_ORDER.indexOf(stage);
  return (
    <>
      <p className="intro">
        Every application has a workspace with a fixed pipeline. The server rejects any other move, and a finished application cannot
        be reopened. Move this sample application along as the employer, or as the student.
      </p>
      <div className="stages">
        {STAGE_ORDER.map((s, i) => (
          <span key={s} className={'stage' + (stage === s ? ' cur' : !rejectedOrWithdrawn && curIdx > i ? ' done' : '')}>{s}</span>
        ))}
        {rejectedOrWithdrawn && <span className="stage bad">{stage}</span>}
      </div>
      <div className="two">
        <div className="stack">
          <b>Employer actions</b>
          <div className="actions">
            {EMP_ACTIONS.map(([to, label]) => (
              <button key={to} className="btn sm" disabled={!NEXT[stage].includes(to)} onClick={() => move(to, 'Employer')}>{label}</button>
            ))}
          </div>
        </div>
        <div className="stack">
          <b>Student actions</b>
          <div className="actions">
            <button className="btn sm dark" disabled={stage !== 'Offer'} onClick={() => move('Hired', 'Student accepted the offer and')}>Accept offer</button>
            <button className="btn sm" disabled={['Hired', 'Rejected', 'Withdrawn'].includes(stage)} onClick={() => move('Withdrawn', 'Student')}>Withdraw</button>
            <button className="btn sm" onClick={() => { setStage('Applied'); setLog(['New sample application sent.']); }}>Start over</button>
          </div>
          <p className="note">Student sees: <span className="chip">{uiStage(stage)}</span></p>
        </div>
      </div>
      <ul className="log" aria-live="polite">
        {log.map((l, i) => <li key={i + l}>{l}</li>)}
      </ul>
    </>
  );
}
