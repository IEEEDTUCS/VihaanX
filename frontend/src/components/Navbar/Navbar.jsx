import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-3.5 transition duration-300 sm:px-12 sm:py-[1.15rem] ${scrolled ? 'bg-black/75 shadow-[0_1px_0_rgba(255,255,255,.06)] backdrop-blur-md' : ''}`} role="navigation" aria-label="Main navigation">
      <a href="/" className="flex items-center gap-2.5" aria-label="IEEE DTU — Home">
        <img
          src="/logos/whiteieee.png"
          alt="IEEE DTU Logo"
          className="h-7 w-auto flex-shrink-0 sm:h-9"
          width="40"
          height="40"
        />
      </a>

      <a href="#" className="relative pb-0.5 text-[.72rem] font-medium tracking-[.18em] text-[#f0f0f0] after:absolute after:-bottom-1 after:inset-x-0 after:h-px after:bg-violet-400">HOME</a>
    </nav>
  );
}
