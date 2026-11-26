export default function Footer() {
  return (
    <footer className="site">
      <div className="container" style={{ display: 'grid', gap: 8 }}>
        <a className="brand" href="#top"><img src="/logo.png" alt="" width={32} height={32} />MentorLink BD</a>
        <p>Demos on this page use sample data and run in your browser. Mentor names and entries are fictional.</p>
      </div>
    </footer>
  );
}
