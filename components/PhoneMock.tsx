'use client';
import { useDemo } from '@/lib/store';
import { ROLES, SK, compute } from '@/lib/data';

// A sample student home screen. It follows the skills set in the Readiness demo.
export default function PhoneMock() {
  const { role, lv, ev } = useDemo();
  const c = compute(role, lv, ev);
  const top = c.gaps[0];
  return (
    <div className="phone" aria-label="Sample student home screen">
      <div className="screen">
        <div className="screen-head">
          <small>Good morning</small>
          <h4>Robiul</h4>
        </div>
        <div className="screen-body">
          <div className="scard">
            <div className="ring-row">
              <div className="ring">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--track)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--violet)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray="264" strokeDashoffset={264 * (1 - c.ready / 100)} style={{ transition: 'stroke-dashoffset .4s' }} />
                </svg>
                <b>{c.ready}%</b>
              </div>
              <div>
                <small>Readiness</small>
                <div className="t">{ROLES[role].name}</div>
                <small>Proven {c.proven}% · Confidence {c.conf}%</small>
              </div>
            </div>
          </div>
          <div className="brief">
            <small>Daily brief</small>
            {top ? `Take the ${SK[top.k]} quiz to prove your biggest gap` : 'Share your passport with a mentor'}
          </div>
          <div className="scard">
            <div className="t" style={{ marginBottom: 4 }}>Do next</div>
            <div className="act"><span className="dot" />Session with a mentor in 20 hours</div>
            <div className="act"><span className="dot" />Sprint day 3: build your dashboard</div>
            <div className="act"><span className="dot" />2 jobs closing soon that fit you</div>
          </div>
        </div>
        <div className="tabbar"><span className="on">Home</span><span>Learn</span><span>Mentors</span><span>Jobs</span><span>Me</span></div>
      </div>
    </div>
  );
}
