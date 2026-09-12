const highlights = [
  ["36", "hours of building"],
  ["₹10L+", "prize pool"],
  ["2,500+", "hackers nationwide"]
];

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="hero-content">
        <div className="eyebrow"><span /> Delhi Technological University <b>×</b> IEEE Student Branch <span /></div>
        <p className="presenter">Presents</p>

        <p className="edition">The 10th edition of</p>
        <h1 id="hero-title">VIHAAN<span>X</span></h1>
        <p className="tagline">North India&apos;s largest student-run hackathon</p>
        <p className="intro">A 36-hour launchpad for bold ideas in space-tech, artificial intelligence, and the future of deep tech.</p>

        <div className="hero-actions">
          <a className="button" href="#register">Register on Devfolio <span>↗</span></a>
          <a className="text-link" href="#about">Explore Vihaan X <span>↓</span></a>
        </div>

        <div className="highlights" aria-label="Event highlights">
          {highlights.map(([value, label]) => (
            <div className="highlight" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="planet-stage" aria-label="Illustration of a ringed planet">
        <div className="planet-glow" />
        <div className="planet-ring planet-ring-back" />
        <div className="planet" />
        <div className="planet-ring planet-ring-front" />
        <div className="planet-caption"><span>01</span><span>Beyond the ordinary</span></div>
      </div>

      <div className="scroll-cue" aria-hidden="true"><span /> Scroll to explore</div>
    </section>
  );
}
