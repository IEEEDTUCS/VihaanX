'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Gallery',  href: '#gallery' },
  { label: 'Tracks',   href: '#tracks' },
  { label: 'Prizes',   href: '#prizes' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Team',     href: '#team' },
];

export default function Navbar() {
  const [active,   setActive]   = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes navGlowShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes navGlowPulse {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
        @keyframes navRightGlow {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
      `}</style>

      <nav className="fixed inset-x-0 top-0 z-20 transition-all duration-500"
           role="navigation" aria-label="Main navigation">

        {/* Right corner glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-20 w-48 hidden lg:block"
          style={{
            background: 'radial-gradient(ellipse at 100% 0%, rgba(255,50,80,0.55) 0%, transparent 65%)',
            filter: 'blur(16px)',
            animation: 'navRightGlow 3s ease-in-out infinite',
          }}
        />

        {/* Animated top glow line */}
        <div className="absolute inset-x-0 top-0 h-[2px] z-10"
          style={{
            background: 'linear-gradient(90deg, rgba(255,23,79,0.8) 0%, #ff4d91 30%, #ff7148 55%, rgba(255,113,72,0.3) 80%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'navGlowShift 4s ease infinite',
          }}
        />

        {/* ── Main bar ── */}
        <div
          className="relative flex items-center px-4 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-[18px]"
          style={{
            background: scrolled ? 'rgba(5,4,14,0.75)' : 'rgba(5,4,14,0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            // diagonal cut only on large screens
            clipPath: 'none',
          }}
        >
          {/* Large-screen diagonal clip via a pseudo overlay */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              clipPath: 'polygon(0% 0%, 90% 0%, 100% 100%, 0% 100%)',
              background: scrolled ? 'rgba(5,4,14,0.75)' : 'rgba(5,4,14,0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          />

          {/* Inner glows */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-32 hidden lg:block"
            style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(255,23,79,0.08) 0%, transparent 70%)' }} />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-56 hidden lg:block"
            style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(255,60,80,0.12) 0%, transparent 60%)' }} />

          {/* Logo */}
          <a href="/" className="relative z-10 shrink-0 mr-6 sm:mr-10 lg:mr-14" aria-label="IEEE DTU">
            <img src="/logos/whiteieee.png" alt="IEEE DTU"
              className="h-7 w-auto sm:h-9 lg:h-[44px]" width="140" height="44" />
          </a>

          {/* Nav links — desktop */}
          <ul className="relative z-10 hidden items-center gap-5 lg:flex xl:gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = active === label;
              return (
                <li key={label}>
                  <a href={href} onClick={() => setActive(label)}
                    className={`relative pb-1 text-[0.75rem] font-medium tracking-[0.14em] uppercase transition-colors duration-200 xl:text-[0.82rem] ${
                      isActive ? 'text-[#ff4d70]' : 'text-white/55 hover:text-white/95'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <>
                        <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] rounded-full"
                          style={{ background: 'linear-gradient(90deg, transparent, #ff4d70, transparent)', animation: 'navGlowPulse 2s ease-in-out infinite' }} />
                        <span className="absolute inset-x-0 -bottom-1 h-[6px] rounded-full opacity-50"
                          style={{ background: '#ff4d70', filter: 'blur(5px)' }} />
                      </>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button className="relative z-10 ml-auto flex flex-col gap-[5px] p-2 lg:hidden"
            onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            <span className={`block h-[1.5px] w-5 bg-white/80 transition-all duration-200 origin-center ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-white/80 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-white/80 transition-all duration-200 origin-center ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>

        {/* SVG border — desktop only */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full overflow-visible hidden lg:block"
          preserveAspectRatio="none" style={{ zIndex: 13 }} aria-hidden="true">
          <defs>
            <filter id="bGlow"><feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="bGlowStrong"><feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="topLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#ff174f" stopOpacity="0.9"/>
              <stop offset="50%"  stopColor="#ff4d91" stopOpacity="0.7"/>
              <stop offset="80%"  stopColor="#ff7148" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#ff174f" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="1" x2="90%" y2="1" stroke="url(#topLine)" strokeWidth="1.5"
            filter="url(#bGlow)" vectorEffect="non-scaling-stroke" />
          <line x1="90%" y1="0" x2="100%" y2="100%" stroke="rgba(255,80,60,1)" strokeWidth="2"
            filter="url(#bGlowStrong)" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="100%" x2="100%" y2="100%" stroke="rgba(255,40,79,0.2)" strokeWidth="1"
            vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Mobile bottom border */}
        <div className="absolute inset-x-0 bottom-0 h-px lg:hidden"
          style={{ background: 'linear-gradient(90deg, rgba(255,23,79,0.4), rgba(255,113,72,0.3), transparent)' }} />

        {/* Mobile dropdown */}
        <div className={`flex flex-col border-t border-white/[0.06] lg:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
          style={{ background: 'rgba(5,4,12,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col gap-0 px-6 py-3">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                onClick={() => { setActive(label); setMenuOpen(false); }}
                className={`py-3 text-[0.78rem] tracking-[0.14em] uppercase border-b border-white/[0.04] last:border-0 transition-colors ${
                  active === label ? 'text-[#ff4d70]' : 'text-white/50 hover:text-white/90'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </nav>
    </>
  );
}
