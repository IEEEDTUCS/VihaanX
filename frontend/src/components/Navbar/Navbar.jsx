'use client';

import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT', href: '#about' },
  { label: 'GALLERY', href: '#gallery' },
  { label: "TRACKS", href: "#tracks" },
  { label: 'PRIZES', href: '#prizes' },
  // { label: 'SPONSORS', href: '#sponsors' },
  // { label: 'TEAM', href: '#team' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('#home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Scroll-spy active section detection
      const sections = NAV_ITEMS.map((item) =>
        document.querySelector(item.href),
      ).filter(Boolean);
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPos) {
          setActiveSection(`#${section.id}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#070b19]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: DTU & IEEE Student Branch Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, "#home")}
          className="flex items-center group cursor-pointer"
          aria-label="Delhi Technological University IEEE Student Branch"
        >
          <img
            src="/logos/dtu_ieee_logo.png"
            alt="Delhi Technological University - IEEE Student Branch"
            className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Center: Desktop Nav Links (Smooth Scroll on same page) */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className={`relative py-1 text-xs tracking-[0.2em] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ff3b6c] rounded-full shadow-[0_0_12px_#ff3b6c]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Register Now Pill Button (Scrolls to #register) */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="#register"
            onClick={(e) => handleScrollTo(e, "#register")}
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold tracking-[0.16em] text-slate-900 transition-all duration-300 hover:bg-[#ff3b6c] hover:text-white hover:shadow-[0_0_24px_rgba(255,59,108,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>REGISTER NOW</span>
            <svg
              className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 mx-2 rounded-2xl bg-[#070b19]/95 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl animate-fade-in">
          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className={`text-xs tracking-[0.2em] font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#ff3b6c] bg-white/5 font-bold"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-3 border-t border-white/10 mt-2">
              <a
                href="#register"
                onClick={(e) => handleScrollTo(e, "#register")}
                className="w-full justify-center flex items-center gap-2 rounded-full bg-[#ff3b6c] px-6 py-3 text-xs font-bold tracking-[0.16em] text-white shadow-[0_0_18px_rgba(255,59,108,0.5)] cursor-pointer"
              >
                <span>REGISTER NOW</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
