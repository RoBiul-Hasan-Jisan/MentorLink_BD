const ITEMS: { tag: string; title: string; text: string; dark?: boolean }[] = [
  { tag: 'Proof Arena', title: 'Real challenges, scored fairly', text: 'Employers post real problems. Students enter alone or in teams and are scored anonymously on one public rubric. Passing results become achievements anyone can verify with a code or QR.', dark: true },
  { tag: 'Mentoring', title: 'Explainable matching', text: 'Six weighted factors, each with its reason. A plain keyword baseline runs beside it so the model can be compared fairly.' },
  { tag: 'Decision Lab', title: 'Which role fits you?', text: 'Compare up to 3 roles and see which skill to learn first, weighted by what real approved postings ask for.' },
  { tag: 'Path Twin', title: 'Who was where you are?', text: 'See what people with your skills learned next, and how many months it took them to a first job.' },
  { tag: 'Career Passport', title: 'A proof profile you own', text: 'Proven skills, projects, verified GitHub and achievements. You choose what is public and can replace the link at any time.' },
  { tag: 'Talent Discovery', title: 'Found by proof, not CV', text: 'Companies search by verified skills. Candidates are anonymous until they accept an invitation.' },
  { tag: 'Jobs and hiring', title: 'Vetted jobs, real workspace', text: 'Only verified companies post. Every post is reviewed and scam-checked. Interviews, papers and offers live in one place.', dark: true },
  { tag: 'Missions', title: 'Real-world experience', text: 'Companies and NGOs publish real projects with clear pay terms. Teams deliver and earn verified experience.' },
  { tag: 'AI interview coach', title: 'Private practice', text: 'Off by default. Practice technical or behavioral interviews in English or Bangla. Never used in hiring or ranking.' },
];

export default function Features() {
  return (
    <section className="block alt" id="features">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Features</p>
          <h2>Everything between &ldquo;I want this&rdquo; and &ldquo;I got it&rdquo;</h2>
        </div>
        <div className="features">
          {ITEMS.map((f) => (
            <div key={f.title} className={'feature' + (f.dark ? ' dark' : '')}>
              <span className="tag">{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
