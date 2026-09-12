export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#hero" aria-label="Vihaan X home">
        <span className="brand-mark" aria-hidden="true">VX</span>
        <span className="brand-copy">
          <strong>VIHAAN <em>X</em></strong>
          <small>DTU IEEE SB</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#hero">Home</a>
        <a href="#about">About</a>
        <a href="#tracks">Tracks</a>
        <a href="#timeline">Timeline</a>
        <a href="#prizes">Prizes</a>
      </nav>

      <div className="header-actions">
        <span className="status-pill"><i /> Registrations open</span>
        <a className="button button-small" href="#register">Apply now <span>↗</span></a>
      </div>
    </header>
  );
}
