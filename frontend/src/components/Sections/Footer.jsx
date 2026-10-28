'use client';

export default function Footer() {
  const handleScrollTo = (e, href) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT VIHAAN', href: '#about' },
    { label: 'EVENT GALLERY', href: '#gallery' },
    { label: 'HACKATHON TRACKS', href: '#tracks' },
    { label: 'PRIZE POOL', href: '#prizes' },
    { label: 'OUR SPONSORS', href: '#sponsors' },
    { label: 'CORE TEAM', href: '#team' },
    { label: 'PORTAL REGISTRATION', href: '#register' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/ieee.dtu',
      handle: '@ieee.dtu',
      color: '#ff3b6c',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/ieee-dtu',
      handle: 'ieee-dtu',
      color: '#38bdf8',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'Email Support',
      href: 'mailto:contact@ieeedtu.in',
      handle: 'contact@ieeedtu.in',
      color: '#a855f7',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      name: 'Previous Edition',
      href: 'https://9.vihaan.ieeedtu.in/',
      handle: 'Vihaan 9.0 Site',
      color: '#fbbf24',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#04060d] pt-16 pb-10 px-4 sm:px-8 text-white select-none overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#ff3b6c]/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#38bdf8]/[0.02] blur-[120px] pointer-events-none" />

      {/* Subtle Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Grid: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* ── Column 1: Brand & Organization Info (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <a
              href="#home"
              onClick={(e) => handleScrollTo(e, '#home')}
              className="flex items-center gap-3 mb-4 group cursor-pointer"
            >
              <img
                src="/logos/dtu_ieee_logo.png"
                alt="Delhi Technological University - IEEE Student Branch"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            <div className="flex items-center gap-2 mb-3">
              <span className="font-tech text-xl font-black tracking-wider text-white">
                VIHAAN X
              </span>
              <span className="text-[0.62rem] font-mono tracking-widest text-[#ff3b6c] border border-[#ff3b6c]/30 bg-[#ff3b6c]/10 px-2.5 py-0.5 rounded-full font-bold">
                10TH EDITION
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed mb-6 max-w-md">
              North India&apos;s largest student-run hackathon, presented by the IEEE Student Branch at
              Delhi Technological University. Fostering bold technological innovation for a decade.
            </p>

            {/* DTU Location telemetry info */}
            <div className="flex items-start gap-2.5 text-xs text-white/50 font-mono mb-4">
              <svg className="w-4 h-4 text-[#ff3b6c] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>
                Delhi Technological University, Shahbad Daulatpur, Main Bawana Road, Delhi 110042
              </span>
            </div>

            {/* Active Telemetry Status */}
            <div className="inline-flex items-center gap-2 text-[0.68rem] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-3.5 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>COSMIC TELEMETRY // ACTIVE</span>
            </div>
          </div>

          {/* ── Column 2: Quick Jump Navigation (4 cols) ── */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="h-px w-5 bg-[#ff3b6c]" style={{ boxShadow: '0 0 6px #ff3b6c' }} />
              <span className="font-tech text-xs tracking-[0.25em] text-[#ff3b6c] uppercase">
                // QUICK JUMP
              </span>
            </div>

            <nav className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="group flex items-center gap-2 text-xs font-mono tracking-wider text-white/60 hover:text-white transition-all py-1 cursor-pointer"
                >
                  <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#ff3b6c] group-hover:scale-150 transition-all shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    {link.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* ── Column 3: Transmissions & Socials (3 cols) ── */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="h-px w-5 bg-[#38bdf8]" style={{ boxShadow: '0 0 6px #38bdf8' }} />
              <span className="font-tech text-xs tracking-[0.25em] text-[#38bdf8] uppercase">
                // TRANSMISSIONS
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="p-1.5 rounded-lg bg-white/5 transition-colors group-hover:scale-105"
                      style={{ color: s.color }}
                    >
                      {s.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors">
                        {s.name}
                      </span>
                      <span className="text-[0.62rem] font-mono text-white/40">
                        {s.handle}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-3.5 h-3.5 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom Strip: Copyright & Back to Top ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[0.68rem] text-white/40 font-mono tracking-wider text-center sm:text-left">
            &copy; {new Date().getFullYear()} IEEE DTU STUDENT BRANCH. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[0.62rem] font-mono tracking-[0.2em] text-white/30">
              VIHAAN 10.0 // CODENAME X
            </span>

            {/* Back to top button */}
            <a
              href="#home"
              onClick={(e) => handleScrollTo(e, '#home')}
              className="group flex items-center gap-2 text-xs font-mono tracking-wider text-white/60 hover:text-white border border-white/10 hover:border-[#ff3b6c]/50 bg-white/[0.02] hover:bg-[#ff3b6c]/10 px-4 py-2 rounded-full transition-all cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <svg
                className="w-3.5 h-3.5 text-[#ff3b6c] group-hover:-translate-y-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
