const STEPS: [string, string][] = [
  ['Pick a goal', '15 career targets, from Data Analysis to Cybersecurity. Set your weekly hours.'],
  ['See your gaps', 'A readiness score and a ranked list of skills to close, with a confidence level.'],
  ['Learn for free', 'Roadmaps, topic notes, quizzes and curated English and Bangla resources.'],
  ['Meet a mentor', 'A 0 to 100 match across six factors, with the reason shown for each one.'],
  ['Build proof', '7-day sprints, projects, GitHub check and mentor endorsements.'],
  ['Share a passport', 'A proof profile with its own link and QR code. Sharing starts switched off.'],
  ['Apply and compete', 'Vetted jobs, employer challenges and real-world missions.'],
  ['Get hired', 'A hiring workspace with interviews, papers, offers and chat.'],
];

export default function Journey() {
  return (
    <section className="block" id="how">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2>One path from goal to offer</h2>
          <p>Each step feeds the next, and every outcome feeds back into your goal. A score always comes with the reason for it.</p>
        </div>
        <div className="steps">
          {STEPS.map(([t, d], i) => (
            <div className="step" key={t}>
              <div className="ic">{i + 1}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
