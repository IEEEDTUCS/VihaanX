import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <a href="/" className="navbar__logo" aria-label="IEEE DTU — Home">
        <img
          src="/landingPage/IEEE_DTU_Logo.png"
          alt="IEEE DTU Logo"
          className="navbar__logo-img"
          width="40"
          height="40"
        />
        <div className="navbar__logo-text">
          <span className="navbar__org-name">Delhi Technological University</span>
          <span className="navbar__branch-name">IEEE Student Branch</span>
        </div>
      </a>

      <ul className="navbar__links">
        <li>
          <a href="#" className="navbar__link navbar__link--active">HOME</a>
        </li>
      </ul>
    </nav>
  );
}
