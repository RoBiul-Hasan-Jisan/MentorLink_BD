const STATS: [string, string][] = [
  ['15', 'career targets'],
  ['64', 'data models'],
  ['24', 'API route modules'],
  ['440', 'automated test cases'],
  ['EN + বাংলা', 'every screen'],
];

export default function Stats() {
  return (
    <div className="stats" aria-label="Platform at a glance">
      {STATS.map(([n, l]) => (
        <div key={l}><b className={n.includes('বাংলা') ? 'bn' : ''}>{n}</b><span>{l}</span></div>
      ))}
    </div>
  );
}
