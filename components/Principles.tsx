const ITEMS: [string, string][] = [
  ['Proof over claims', 'Quiz results, mentor-reviewed projects, endorsements, challenge results and verified missions count as evidence. Self-ratings never do.'],
  ['Consent first', 'Passports, talent search and outcome tracking all start switched off. Students can download all their data or delete their account at any time.'],
  ['Fair ranking', 'Ranking never uses university, name, gender or background. A test swaps them and checks that the order does not change.'],
  ['No AI scores in hiring', 'Arena evaluations are always human. The optional interview coach is private practice and never feeds ranking.'],
];

export default function Principles() {
  return (
    <section className="block principles" id="principles">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Principles</p>
          <h2>Proof, consent and fairness by default</h2>
        </div>
        <div className="grid2">
          {ITEMS.map(([t, d]) => (
            <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}
