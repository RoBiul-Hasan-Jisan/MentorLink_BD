// Rules and sample data for the demos. The formulas match the backend services
// (readiness.js, matching.js, scam.js, hiring stages, arena rubric). Weights and
// mentor profiles here are sample values for display only.

export type RoleKey = 'da' | 'be';
export type EvKey = 'self' | 'quiz' | 'project' | 'endorsement';

export const SK: Record<string, string> = {
  sql: 'SQL', excel: 'Excel', python: 'Python', stats: 'Statistics', dash: 'Dashboards',
  comm: 'Communication', git: 'Git', apis: 'Backend APIs', ds: 'Data Structures', test: 'Software Testing',
};
export const LV = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];
export const EV: Record<EvKey, string> = {
  self: 'Self-rated', quiz: 'Quiz', project: 'Reviewed project', endorsement: 'Mentor endorsed',
};

// skill -> [weight, required level]
export const ROLES: Record<RoleKey, { name: string; req: Record<string, [number, number]> }> = {
  da: { name: 'Data Analyst', req: { sql: [3, 2], excel: [2, 2], python: [2, 2], stats: [2, 2], dash: [2, 2], comm: [1, 2] } },
  be: { name: 'Backend Developer', req: { python: [3, 2], apis: [3, 2], sql: [2, 2], git: [2, 2], ds: [2, 2], test: [1, 2] } },
};

export const INITIAL_LEVELS: Record<string, number> = { sql: 2, excel: 2, python: 1, stats: 1, dash: 0, comm: 2, git: 1, apis: 0, ds: 1, test: 0 };
export const INITIAL_EVIDENCE: Record<string, EvKey> = {
  sql: 'quiz', excel: 'self', python: 'project', stats: 'self', dash: 'self', comm: 'self', git: 'self', apis: 'self', ds: 'self', test: 'self',
};

export type Gap = { k: string; pri: number; l: number; r: number };

export function compute(role: RoleKey, lv: Record<string, number>, ev: Record<string, EvKey>) {
  const req = ROLES[role].req;
  let sw = 0, a = 0, p = 0, backed = 0, n = 0;
  const gaps: Gap[] = [];
  for (const k of Object.keys(req)) {
    const [w, r] = req[k];
    const l = lv[k];
    const proofed = ev[k] !== 'self' && l > 0;
    sw += w; a += w * Math.min(l / r, 1); p += w * Math.min((proofed ? l : 0) / r, 1); n++;
    if (proofed) backed++;
    if (l < r) gaps.push({ k, pri: w * (r - l), l, r });
  }
  gaps.sort((x, y) => y.pri - x.pri);
  return { ready: Math.round((100 * a) / sw), proven: Math.round((100 * p) / sw), conf: Math.round((100 * backed) / n), gaps };
}

/* ---------- mentors ---------- */
export const SLOTS: Record<string, string> = {
  'sat-m': 'Sat morning', 'sun-e': 'Sun evening', 'mon-e': 'Mon evening', 'wed-e': 'Wed evening', 'thu-a': 'Thu afternoon', 'fri-m': 'Fri morning',
};
export const LANGS: Record<string, string> = { bn: 'বাংলা', en: 'English' };

type Mentor = {
  n: string; r: string; y: number; lang: string[]; slots: string[]; rel: number;
  fit: Record<RoleKey, number>; lv: Record<string, number>;
};
export const MENTORS: Mentor[] = [
  { n: 'Samira C.', r: 'Senior Data Analyst', y: 8, lang: ['bn', 'en'], slots: ['sat-m', 'mon-e', 'wed-e'], rel: 0.92, fit: { da: 0.92, be: 0.25 }, lv: { sql: 3, excel: 3, python: 2, stats: 3, dash: 3, comm: 3, git: 2, apis: 1, ds: 1, test: 1 } },
  { n: 'Kamal U.', r: 'Backend Engineer', y: 10, lang: ['bn', 'en'], slots: ['sun-e', 'wed-e', 'fri-m'], rel: 0.88, fit: { da: 0.3, be: 0.95 }, lv: { sql: 3, excel: 1, python: 3, stats: 1, dash: 1, comm: 2, git: 3, apis: 3, ds: 3, test: 3 } },
  { n: 'Nabila K.', r: 'Product Analyst', y: 4, lang: ['en'], slots: ['thu-a', 'sat-m'], rel: 0.5, fit: { da: 0.75, be: 0.2 }, lv: { sql: 2, excel: 3, python: 2, stats: 2, dash: 3, comm: 3, git: 1, apis: 1, ds: 1, test: 0 } },
  { n: 'Rubel M.', r: 'Full-stack Developer', y: 5, lang: ['bn'], slots: ['mon-e', 'thu-a'], rel: 0.7, fit: { da: 0.3, be: 0.8 }, lv: { sql: 2, excel: 1, python: 3, stats: 1, dash: 1, comm: 2, git: 3, apis: 3, ds: 2, test: 2 } },
];

export type Factor = { label: string; v: number; max: number; why: string };

export function matchMentors(
  role: RoleKey, lv: Record<string, number>, ev: Record<string, EvKey>,
  langs: Record<string, boolean>, slots: Record<string, boolean>,
) {
  const c = compute(role, lv, ev);
  const totalPri = c.gaps.reduce((s, g) => s + g.pri, 0);
  const myL = Object.keys(langs).filter((k) => langs[k]);
  const mySl = Object.keys(slots).filter((k) => slots[k]);
  return MENTORS.map((m) => {
    const fit = m.fit[role];
    const cov = totalPri ? c.gaps.filter((g) => m.lv[g.k] >= g.r).reduce((s, g) => s + g.pri, 0) / totalPri : 1;
    const exp = (Math.min(m.y, 10) / 10) * fit;
    const lang = myL.length ? myL.filter((l) => m.lang.includes(l)).length / myL.length : 0;
    const matches = mySl.filter((s) => m.slots.includes(s)).length;
    const sch = Math.min(matches / 2, 1);
    const factors: Factor[] = [
      { label: 'Career fit', v: fit, max: 30, why: Math.round(fit * 100) + '% match to ' + ROLES[role].name },
      { label: 'Gap coverage', v: cov, max: 25, why: Math.round(cov * 100) + '% of your gap priority' },
      { label: 'Experience', v: exp, max: 15, why: m.y + ' years' },
      { label: 'Language', v: lang, max: 10, why: m.lang.map((l) => LANGS[l]).join(', ') },
      { label: 'Schedule', v: sch, max: 10, why: matches + ' matching slot' + (matches === 1 ? '' : 's') },
      { label: 'Reliability', v: m.rel, max: 10, why: m.rel === 0.5 ? 'New mentor, neutral start' : Math.round(m.rel * 100) + '% of sessions completed' },
    ];
    return { m, factors, total: factors.reduce((s, f) => s + f.v * f.max, 0) };
  }).sort((a, b) => b.total - a.total);
}

/* ---------- scam signals ---------- */
export const PATTERNS: [RegExp, string, string][] = [
  [/registration fee|processing fee|security deposit|pay (us|first)|joining fee|training fee/i, 'asks_for_fee', 'Asks the applicant to pay a fee'],
  [/bkash|nagad|rocket|send money|advance payment/i, 'mobile_money', 'Mentions mobile money or advance payment'],
  [/whatsapp only|telegram only|dm me|contact on whatsapp/i, 'off_platform_contact', 'Moves the conversation off the platform'],
  [/guaranteed (job|income)|earn \d+.*(daily|per day)|no experience.*high salary|easy money/i, 'too_good_to_be_true', 'Promises results that sound too good to be true'],
  [/ফি|টাকা পাঠান|অগ্রিম/, 'asks_for_fee_bn', 'Asks for a fee or advance payment in Bangla'],
];
export const SCAM_SAMPLES = {
  good: 'Junior Data Analyst at Demo Bay Analytics, Dhaka. Salary BDT 25,000 to 32,000 per month. 2 vacancies. You will build weekly dashboards in SQL and Excel with our senior analyst. Apply on MentorLink with your CV. Deadline: 20 days from today.',
  bad: 'Earn 5000 per day from home! Guaranteed job, no experience needed. Pay a small registration fee of 1500 BDT via bKash to confirm your seat. Contact on WhatsApp only.',
  bn: 'চাকরি নিশ্চিত! আজই অগ্রিম ৫০০ টাকা পাঠান এবং ইন্টারভিউয়ের জন্য প্রস্তুত থাকুন।',
};

/* ---------- hiring pipeline ---------- */
export const NEXT: Record<string, string[]> = {
  Applied: ['Under Review', 'Shortlisted', 'Rejected'],
  'Under Review': ['Shortlisted', 'Rejected'],
  Shortlisted: ['Interview', 'Rejected'],
  Interview: ['Offer', 'Rejected'],
  Offer: ['Hired', 'Rejected'],
  Hired: [], Rejected: [], Withdrawn: [],
};
export const STAGE_ORDER = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Offer', 'Hired'];
export function uiStage(s: string) {
  if (s === 'Applied' || s === 'Under Review') return 'Applied';
  if (s === 'Shortlisted') return 'Shortlisted';
  if (s === 'Interview') return 'Interview';
  if (s === 'Offer' || s === 'Hired') return 'Selected';
  if (s === 'Rejected') return 'Not selected';
  return 'Withdrawn';
}

/* ---------- proof arena ---------- */
export const CRITERIA = ['Technical quality', 'Problem solving', 'Creativity', 'Implementation', 'Documentation'];
export const DEFAULT_WEIGHTS = [30, 25, 15, 20, 10];
export const ENTRIES = [
  { code: 'A7F2', uni: 'Rajshahi Univ.', s: [8, 7, 6, 8, 9] },
  { code: 'K3Q9', uni: 'Dhaka Univ.', s: [9, 8, 5, 6, 4] },
  { code: 'M5D1', uni: 'Chattogram Univ.', s: [6, 7, 9, 9, 7] },
];

/* ---------- passport ---------- */
export const PASSPORT_SECTIONS: Record<string, [string, string]> = {
  skills: ['Proven skills', 'SQL: Intermediate (quiz). Excel: Intermediate (mentor endorsed).'],
  projects: ['Projects', 'Sales dashboard, reviewed by a mentor.'],
  github: ['Verified GitHub', 'github.com/robiul-demo, ownership checked.'],
  sprints: ['Sprints', 'SQL sprint, 7 days, finished.'],
  arena: ['Arena achievements', 'Challenge finalist, with a public verify code.'],
  missions: ['Verified missions', 'Verified mission experience, 1 team.'],
};
