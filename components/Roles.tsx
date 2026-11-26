const ROLES: { t: string; d: string; wide?: boolean }[] = [
  { t: 'Students', d: 'A clear route from goal to offer. Free resources, mentors, an ATS-friendly CV maker, a GitHub ownership check, an application tracker and a Daily Brief that picks one move for today.' },
  { t: 'Mentors', d: 'Usually alumni. Review work, endorse skills up to their own level, share a journey, run workshops and see their own impact with a certificate.' },
  { t: 'Employers', d: 'Post to a verified company, run a hiring workspace, search talent by proof and publish challenges and missions. Analytics show counts, never names.' },
  { t: 'Departments and universities', d: 'Read-only analytics with groups under 5 hidden, mentor approval and a CSV report.' },
  { t: 'Admins', d: 'Verify companies and documents, review every job before it goes live, moderate reports, watch fairness and abuse, and keep an audit log of every sensitive view. Admins never see CVs or contact details.', wide: true },
];

export default function Roles() {
  return (
    <section className="block alt" id="roles">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Who it is for</p>
          <h2>Five kinds of people, one system</h2>
        </div>
        <div className="grid2">
          {ROLES.map((r) => (
            <div key={r.t} className={'card' + (r.wide ? ' span2' : '')}>
              <h3>{r.t}</h3>
              <p>{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
