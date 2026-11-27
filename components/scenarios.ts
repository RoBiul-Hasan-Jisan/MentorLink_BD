// "See what happens in the app": four short stories, stepped through next to a phone screen.
// All names and numbers are sample data. The readiness numbers follow the same formula as the demo rules
// (weight x min(level / required, 1)). Returns a cleanup function.

type Step = { t: string; d: string; b: string; head: [string, string]; body: string };
type Scenario = { id: string; tab: string; who: string; steps: Step[] };

const ring = (p: number) =>
  `<div class="ring" style="background:conic-gradient(#8a63f2 ${p}%,#e9e5f3 0)"><b>${p}%</b></div>`;
const bar = (label: string, right: string, pct: number) =>
  `<div class="sx-lbl"><span>${label}</span><span>${right}</span></div><div class="sx-bar"><i style="width:${pct}%"></i></div>`;
const chips = (items: string[], cls = '') => items.map((x) => `<span class="sx-chip ${cls}">${x}</span>`).join('');
const stages = (labels: string[], at: number) =>
  `<div class="sx-stages">${labels
    .map((l, i) => `<div class="${i < at ? 'done' : i === at ? 'now' : ''}"><i></i><span>${l}</span></div>`)
    .join('')}</div>`;

const SCENARIOS: Scenario[] = [
  {
    id: 'student', tab: 'Rina picks a career', who: 'Student',
    steps: [
      {
        t: 'Pick a goal',
        d: 'Rina is in her third year. She picks Data Analyst out of 15 career paths and says she can give 6 hours a week.',
        b: 'The app loads the skills that approved job posts ask for, each with a weight and a required level.',
        head: ['Choose your goal', 'Career paths'],
        body: `<div class="card">${chips(['Machine Learning', 'Data Analysis', 'Backend', 'Cybersecurity', 'UI/UX'], '')
          .replace('sx-chip ">Data Analysis', 'sx-chip on">Data Analysis')}</div>
          <div class="card">${bar('Weekly hours', '6 hours', 30)}</div>`,
      },
      {
        t: 'See where she stands',
        d: 'She rates herself: SQL and Excel at Intermediate, the rest lower. The app shows 54% readiness and her biggest gaps.',
        b: 'Gaps are ranked by weight x (required level - her level). Statistics and Dashboards come first.',
        head: ['Good morning', 'Rina'],
        body: `<div class="card ready">${ring(54)}<div><small>Readiness</small><b class="sx-t">Data Analyst</b><small>Proven 0% · Confidence 0%</small></div></div>
          <div class="card"><b class="sx-t">Biggest gaps</b>${bar('Statistics', 'Beginner → Intermediate', 100)}${bar('Dashboards', 'Beginner → Intermediate', 100)}${bar('Python', 'Elementary → Intermediate', 50)}</div>`,
      },
      {
        t: 'Prove one skill',
        d: 'She takes the SQL quiz and scores 8 out of 10. That counts as real evidence for SQL.',
        b: 'Self-ratings never count as proof. A quiz, a reviewed project or an endorsement does. Proven readiness rises to 25%.',
        head: ['SQL quiz', 'Result'],
        body: `<div class="card"><b class="sx-t">8 / 10</b><small>Level: Intermediate</small><div style="margin-top:8px">${chips(['Counts as proof'], 'ok')}</div></div>
          <div class="card ready">${ring(25)}<div><small>Proven readiness</small><b class="sx-t">1 of 6 skills</b><small>Readiness stays 54%</small></div></div>`,
      },
      {
        t: 'Meet a mentor',
        d: 'The app ranks mentors for her gaps. Samira scores 92 and speaks Bangla. Rina sends one request.',
        b: 'Six factors, each with its points: career fit, gap coverage, experience, language, schedule, reliability. University and gender are never used.',
        head: ['Mentors for', 'Data Analyst'],
        body: `<div class="card hl"><div class="sx-split"><div><b class="sx-t">Samira C.</b><small>Senior Data Analyst</small></div><span class="sx-score">92</span></div>
          <div style="margin-top:8px">${chips(['Covers your Statistics gap', 'Speaks বাংলা', '2 shared slots'])}</div></div>
          <div class="card"><div class="sx-split"><div><b class="sx-t">Nabila K.</b><small>Product Analyst</small></div><span class="sx-score">78</span></div></div>
          <button class="sx-btn" tabindex="-1">Send request</button>`,
      },
      {
        t: 'Share her proof',
        d: 'Rina turns sharing on and chooses three sections for her Career Passport. She gets a link and a QR code.',
        b: 'Sharing starts off. She controls each section and can replace the link at any time, which stops the old one working.',
        head: ['Career Passport', 'Rina'],
        body: `<div class="card"><div class="sx-split"><b class="sx-t">Proof strength</b><span class="sx-score">56</span></div></div>
          <div class="card"><div class="sx-row"><i class="sx-tick">✓</i>SQL: Intermediate · quiz</div><div class="sx-row"><i class="sx-tick">✓</i>Sales dashboard · reviewed project</div><div class="sx-row"><i class="sx-tick">✓</i>GitHub ownership verified</div></div>
          <div class="card"><small>Sharing is on. 3 sections public. No email, phone or address is shown.</small></div>`,
      },
    ],
  },
  {
    id: 'scam', tab: 'A fake job message', who: 'Safety',
    steps: [
      {
        t: 'A suspicious post arrives',
        d: 'Someone submits a job post that says: "Pay a registration fee via bKash. Contact on WhatsApp only."',
        b: 'Only verified companies can post, and every post waits for review before students see it.',
        head: ['New job post', 'Waiting'],
        body: `<div class="card"><small>Submitted by an unverified account</small><p class="sx-quote">“Pay a registration fee via bKash. Contact on WhatsApp only.”</p></div>`,
      },
      {
        t: 'The check flags it',
        d: 'Three signals match: asking for a fee, mobile money, and moving the chat off the platform.',
        b: 'Plain pattern rules, so every flag has a reason. The same check runs on chat messages.',
        head: ['Scam check', '3 signals'],
        body: `<div class="card"><b class="sx-t">Why it was flagged</b><div style="margin-top:8px">${chips(['asks_for_fee', 'mobile_money', 'off_platform_contact'], 'bad')}</div></div>
          <div class="card"><small>The post is not visible to students.</small></div>`,
      },
      {
        t: 'An admin reviews it',
        d: 'The post lands in the admin queue with its flags. The admin sees the post, not any student CV or contact details.',
        b: 'Nothing is deleted automatically. A human decides, and the decision is written to an audit log.',
        head: ['Admin queue', 'Held for review'],
        body: `<div class="card hl"><div class="sx-split"><b class="sx-t">Held for review</b>${chips(['3 flags'], 'bad')}</div><small>Reason codes shown above the post</small></div>
          <div class="sx-actions"><button class="sx-btn" tabindex="-1">Reject post</button><button class="sx-btn ghost" tabindex="-1">Approve</button></div>`,
      },
      {
        t: 'Students stay safe',
        d: 'The admin rejects it. Students never saw it. The account is marked for follow-up.',
        b: 'A student can also report a post or a message. Reports go to the same queue.',
        head: ['Admin queue', 'Resolved'],
        body: `<div class="card"><div class="sx-row"><i class="sx-tick">✓</i>Post rejected</div><div class="sx-row"><i class="sx-tick">✓</i>Account flagged for follow-up</div><div class="sx-row"><i class="sx-tick">✓</i>Audit log entry saved</div></div>`,
      },
    ],
  },
  {
    id: 'hire', tab: 'Applying and getting hired', who: 'Hiring',
    steps: [
      {
        t: 'Apply with proof',
        d: 'Rina applies to Junior Data Analyst at Demo Bay Analytics and shares her Career Passport.',
        b: 'The company is verified and the post passed review. An application workspace opens for both sides.',
        head: ['Junior Data Analyst', 'Demo Bay Analytics'],
        body: `<div class="card">${chips(['Verified company'], 'ok')}<div style="margin-top:8px">${stages(['Applied', 'Shortlisted', 'Interview', 'Selected'], 0)}</div></div>
          <div class="card"><small>Passport attached: 3 sections</small></div>`,
      },
      {
        t: 'The employer shortlists her',
        d: 'The employer reviews proof, not a university name, and moves her to Shortlisted. Rina gets a notification.',
        b: 'Moves follow a fixed pipeline. The server rejects any other move.',
        head: ['Junior Data Analyst', 'Demo Bay Analytics'],
        body: `<div class="card"><div style="margin-bottom:8px">${stages(['Applied', 'Shortlisted', 'Interview', 'Selected'], 1)}</div><small>Status: Shortlisted</small></div>`,
      },
      {
        t: 'Interview in the workspace',
        d: 'An interview time is set. Chat, papers and the schedule all live in one place.',
        b: 'Chat is only available inside the application, and is scam-checked like every message.',
        head: ['Interview', 'Application workspace'],
        body: `<div class="card"><div style="margin-bottom:8px">${stages(['Applied', 'Shortlisted', 'Interview', 'Selected'], 2)}</div><small>Interview scheduled</small></div>
          <div class="card"><div class="sx-bub l">Welcome Rina. Please bring your dashboard project.</div><div class="sx-bub r">Thank you, I will.</div></div>`,
      },
      {
        t: 'Offer and acceptance',
        d: 'The employer sends an offer. Rina sees Selected, accepts, and the application is closed as Hired.',
        b: 'Rina sees simple labels. The employer sees the full stages. A finished application cannot be reopened.',
        head: ['Offer', 'Demo Bay Analytics'],
        body: `<div class="card"><div style="margin-bottom:8px">${stages(['Applied', 'Shortlisted', 'Interview', 'Selected'], 4)}</div>${chips(['Hired'], 'ok')}</div>
          <button class="sx-btn" tabindex="-1">Accept offer</button>`,
      },
    ],
  },
  {
    id: 'talent', tab: 'An employer finds Rina', who: 'Employer',
    steps: [
      {
        t: 'Search by verified skill',
        d: 'A company looks for people with SQL at Intermediate or higher, backed by real evidence.',
        b: 'Only students who switched Talent Discovery on can appear. It is off by default.',
        head: ['Talent search', 'Employer'],
        body: `<div class="card"><small>Filters</small><div style="margin-top:6px">${chips(['SQL ≥ Intermediate', 'Verified evidence', 'Dhaka'])}</div></div>`,
      },
      {
        t: 'Results are anonymous',
        d: 'The company sees "Candidate K7M2" with proven skills. No name, no university, no photo.',
        b: 'Ranking uses verified skills only. A fairness test swaps name and university and checks that the order stays the same.',
        head: ['Talent search', '2 candidates'],
        body: `<div class="card hl"><div class="sx-split"><b class="sx-t">Candidate K7M2</b><span class="sx-score">84</span></div><div style="margin-top:6px">${chips(['SQL · quiz', 'Excel · endorsed', 'Project · reviewed'], 'ok')}</div></div>
          <div class="card"><div class="sx-split"><b class="sx-t">Candidate P3X8</b><span class="sx-score">71</span></div></div>`,
      },
      {
        t: 'Send an invitation',
        d: 'The company sends a short invitation to K7M2 explaining the role.',
        b: 'Rina sees the company and the role. The company still does not see who she is.',
        head: ['Invitation', 'Sent to K7M2'],
        body: `<div class="card"><p class="sx-quote">“We are hiring a junior analyst. Would you like to talk?”</p></div>
          <div class="card"><small>Waiting for the student to respond</small></div>`,
      },
      {
        t: 'Rina decides',
        d: 'Rina accepts. Only now does the company see her name. If she had declined, they never would.',
        b: 'Accepting opens a conversation. Declining closes it and reveals nothing.',
        head: ['Invitation', 'Accepted'],
        body: `<div class="card hl"><div class="sx-split"><b class="sx-t">Rina Akter</b>${chips(['Accepted'], 'ok')}</div><small>Name shared after acceptance</small></div>
          <button class="sx-btn" tabindex="-1">Start conversation</button>`,
      },
    ],
  },
];

export function initScenarios(): () => void {
  const mount = document.getElementById('scn');
  if (!mount) return () => {};
  const cleanups: Array<() => void> = [];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sc = 0, st = 0, playing = !reduce, visible = false;
  let timer: number | undefined;

  mount.innerHTML = `
    <div class="scn-tabs" role="tablist" aria-label="Scenarios"></div>
    <div class="scn-body">
      <ol class="scn-steps"></ol>
      <div class="scn-phone">
        <div class="scn-glow" aria-hidden="true"></div>
        <div class="phone"><div class="screen scn-screen" aria-live="polite"></div></div>
        <div class="scn-ctrl">
          <button class="btn ghost sm" data-a="prev">Back</button>
          <span class="scn-count" aria-live="polite"></span>
          <button class="btn ghost sm" data-a="next">Next</button>
          <button class="btn ghost sm" data-a="play"></button>
        </div>
      </div>
    </div>`;
  const tabs = mount.querySelector('.scn-tabs') as HTMLElement;
  const list = mount.querySelector('.scn-steps') as HTMLElement;
  const screen = mount.querySelector('.scn-screen') as HTMLElement;
  const count = mount.querySelector('.scn-count') as HTMLElement;
  const playBtn = mount.querySelector('[data-a="play"]') as HTMLButtonElement;

  tabs.innerHTML = SCENARIOS.map(
    (s, i) => `<button role="tab" data-sc="${i}" id="scn-tab-${s.id}"><small>${s.who}</small>${s.tab}</button>`,
  ).join('');

  function render() {
    const s = SCENARIOS[sc];
    const cur = s.steps[st];
    tabs.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-selected', String(i === sc)));
    list.innerHTML = s.steps
      .map(
        (x, i) => `<li><button class="scn-step${i === st ? ' on' : ''}${i < st ? ' past' : ''}" data-st="${i}" ${i === st ? 'aria-current="step"' : ''}>
          <span class="scn-n">${i < st ? '✓' : i + 1}</span>
          <span class="scn-txt"><b>${x.t}</b>
          <span class="scn-d">${x.d}</span>
          <span class="scn-b"><em>Behind the scenes</em>${x.b}</span></span></button></li>`,
      )
      .join('');
    screen.innerHTML = `<div class="top"><small>${cur.head[0]}</small><b>${cur.head[1]}</b></div><div class="sx-body">${cur.body}</div>`;
    screen.classList.remove('swap');
    void screen.offsetWidth;
    screen.classList.add('swap');
    count.textContent = `Step ${st + 1} of ${s.steps.length}`;
    playBtn.textContent = playing ? 'Pause' : 'Play';
    (mount!.querySelector('[data-a="prev"]') as HTMLButtonElement).disabled = st === 0;
  }

  function advance() {
    const n = SCENARIOS[sc].steps.length;
    st = st + 1 >= n ? 0 : st + 1;
    render();
  }
  function schedule() {
    window.clearInterval(timer);
    if (playing && visible) timer = window.setInterval(advance, 5200);
  }
  function stop() { playing = false; schedule(); }

  const onClick = (e: Event) => {
    const t = e.target as HTMLElement;
    const tab = t.closest('[data-sc]') as HTMLElement | null;
    const step = t.closest('[data-st]') as HTMLElement | null;
    const act = t.closest('[data-a]') as HTMLElement | null;
    if (tab) { sc = +(tab.dataset.sc as string); st = 0; stop(); render(); return; }
    if (step) { st = +(step.dataset.st as string); stop(); render(); return; }
    if (act) {
      const a = act.dataset.a;
      if (a === 'next') { stop(); const n = SCENARIOS[sc].steps.length; st = Math.min(n - 1, st + 1); render(); }
      if (a === 'prev') { stop(); st = Math.max(0, st - 1); render(); }
      if (a === 'play') { playing = !playing; schedule(); render(); }
    }
  };
  mount.addEventListener('click', onClick);
  cleanups.push(() => mount.removeEventListener('click', onClick));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; schedule(); }, { threshold: 0.35 });
    io.observe(mount);
    cleanups.push(() => io.disconnect());
  }
  cleanups.push(() => window.clearInterval(timer));
  render();
  return () => cleanups.forEach((c) => c());
}
