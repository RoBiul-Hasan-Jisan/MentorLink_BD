export default function Header() {
  return (
    <header className="nav">
      <div className="container">
        <a className="brand" href="#top">
          <img src="/logo.png" alt="" width={32} height={32} />
          MentorLink BD
        </a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#roles">Who it is for</a>
          <a className="btn violet sm" href="#demo">Try the demos</a>
        </nav>
      </div>
    </header>
  );
}
