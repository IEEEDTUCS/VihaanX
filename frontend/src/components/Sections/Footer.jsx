'use client';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#04060d] py-12 px-4 sm:px-8 text-white select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="/logos/dtu_ieee_logo.png"
            alt="Delhi Technological University - IEEE Student Branch"
            className="h-8 w-auto object-contain mb-3 opacity-90"
          />
          <div className="flex items-center gap-2 mb-1">
            <span className="font-tech text-lg font-black tracking-wider text-white">
              VIHAAN X
            </span>
            <span className="text-xs font-mono text-[#ff3b6c] border border-[#ff3b6c]/30 bg-[#ff3b6c]/10 px-2 py-0.5 rounded-full">
              10TH EDITION
            </span>
          </div>
          <p className="text-xs text-white/50 font-light">
            Organized by IEEE Student Branch, Delhi Technological University.
          </p>
        </div>

        {/* Social / Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono tracking-widest text-white/60">
          <a
            href="https://9.vihaan.ieeedtu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            VIHAAN 09
          </a>
          <a
            href="https://instagram.com/ieee.dtu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff3b6c] transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href="https://linkedin.com/company/ieee-dtu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            LINKEDIN
          </a>
          <a
            href="mailto:contact@ieeedtu.in"
            className="hover:text-purple-400 transition-colors"
          >
            CONTACT
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[0.68rem] text-white/40 font-mono">
          &copy; {new Date().getFullYear()} IEEE DTU. ALL RIGHTS RESERVED.
        </div>

      </div>
    </footer>
  );
}
