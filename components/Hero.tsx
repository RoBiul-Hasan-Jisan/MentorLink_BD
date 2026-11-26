import PhoneMock from './PhoneMock';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">For Bangladeshi university students</p>
          <h1 style={{ marginTop: 18 }}>
            Don&apos;t just collect certificates. <em>Prove</em> what you can build.
          </h1>
          <p className="lead">
            MentorLink BD takes you from &ldquo;I want this career&rdquo; to &ldquo;I got hired&rdquo;. Learn free, get matched with
            a mentor, earn evidence anyone can verify, and let employers find you by proof instead of prestige.
          </p>
          <div className="cta-row">
            <a className="btn violet" href="#demo">Try the live demos</a>
            <a className="btn ghost-light" href="#how">See how it works</a>
          </div>
          <div className="hero-meta">
            <span className="pill">English + <span className="bn">বাংলা</span></span>
            <span className="pill">Flutter app</span>
            <span className="pill">Node.js API</span>
            <span className="pill">Next.js admin panel</span>
          </div>
        </div>
        <div className="phone-wrap">
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}
