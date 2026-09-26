import Countdown from '../Countdown/Countdown';
import './Hero.css';

export default function Hero({ isLoaded, onPreviousEditions }) {
  const a = isLoaded ? ' hero--visible' : '';

  return (
    <section className="hero">
      {/* ── Left side text ── */}
      <aside className={`hero__sidebar hero__sidebar--left${a}`} aria-hidden="true">
        <div className="hero__sidebar-group">
          <p>A DECADE</p>
          <p>OF DREAMERS</p>
        </div>
        <div className="hero__sidebar-group">
          <p>TECHNOLOGY</p>
          <p>FOR A BETTER</p>
          <p>TOMORROW</p>
        </div>
        <div className="hero__sidebar-group">
          <p>PEOPLE</p>
          <p>IDEAS</p>
          <p>IMPACT</p>
        </div>
      </aside>

      {/* ── Right side text ── */}
      <aside className={`hero__sidebar hero__sidebar--right${a}`} aria-hidden="true">
        <div className="hero__sidebar-group">
          <p>INNOVATE</p>
          <p>BUILD</p>
          <p>BELONG</p>
        </div>
        <div className="hero__sidebar-group">
          <p>IDEAS</p>
          <p>BEYOND</p>
          <p>LIMITS</p>
        </div>
      </aside>

      {/* ── Center content ── */}
      <div className="hero__center">
        <p className={`hero__presents${a}`}>PRESENTS THE 10TH EDITION OF</p>

        <div className={`hero__title-wrap${a}`}>
          <h1 className="hero__title">VIHAAN</h1>
          <img
            src="/landingPage/X.svg"
            alt=""
            className="hero__x-img"
            aria-hidden="true"
            width="280"
            height="320"
          />
        </div>

        <div className={`hero__tagline${a}`}>
          <span className="hero__dash" />
          <p>NORTH INDIA&rsquo;S LARGEST STUDENT-RUN HACKATHON</p>
          <span className="hero__dash" />
        </div>

        <button
          className={`hero__cta${a}`}
          onClick={onPreviousEditions}
          type="button"
        >
          <span>PREVIOUS EDITIONS</span>
          <span className="hero__cta-arrow">&rarr;</span>
        </button>

        <div className={`hero__countdown-wrap${a}`}>
          <Countdown />
        </div>
      </div>

      {/* ── Astronaut ── */}
      <div className={`hero__astronaut${a}`}>
        <img
          src="/landingPage/astronaut.png"
          alt="Astronaut sitting on the edge of a cliff, gazing at the cosmos"
          width="600"
          height="730"
        />
      </div>
    </section>
  );
}
