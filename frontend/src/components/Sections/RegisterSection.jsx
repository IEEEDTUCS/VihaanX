'use client';

export default function RegisterSection() {
  return (
    <section
      id="register"
      className="relative min-h-[80vh] w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-gradient-to-b from-[#070b19] via-[#091129] to-[#04060d] overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        
        {/* Glow backdrop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#ff3b6c]/15 blur-3xl pointer-events-none" />

        {/* Tag */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-8 bg-[#ff3b6c]" />
          <span className="font-tech text-xs tracking-[0.3em] text-[#ff3b6c] uppercase">
            // TELEMETRY PORTAL
          </span>
          <span className="h-px w-8 bg-[#ff3b6c]" />
        </div>

        <h2 className="font-tech text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white mb-6">
          JOIN THE ODYSSEY
        </h2>

        <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto font-light leading-relaxed mb-10">
          Registrations for VIHAAN X are open on Unstop. Assemble your squad of 2 to 4 hackers and prepare for the 24-hour sprint.
        </p>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a
            href="/register"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#ff3b6c] px-9 py-4 text-sm font-bold tracking-[0.18em] text-white transition-all duration-300 shadow-[0_0_35px_rgba(255,59,108,0.7)] hover:bg-[#ff1e56] hover:shadow-[0_0_50px_rgba(255,59,108,1)] hover:scale-105 active:scale-95"
          >
            <span>REGISTER ON UNSTOP</span>
            <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <a
            href="https://9.vihaan.ieeedtu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold tracking-widest text-white/90 hover:border-cyan-400 hover:text-cyan-300 transition-all"
          >
            VIEW PREVIOUS WINNERS &rarr;
          </a>
        </div>

        {/* Quick FAQs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-white/10 pt-10">
          <div className="rounded-2xl border border-white/5 bg-[#0c1433]/30 p-5">
            <h4 className="font-tech text-xs font-bold text-white mb-1.5">TEAM SIZE</h4>
            <p className="text-xs text-white/60 font-light">Teams of 2 to 4 members from any accredited college/university.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#0c1433]/30 p-5">
            <h4 className="font-tech text-xs font-bold text-white mb-1.5">REGISTRATION FEE</h4>
            <p className="text-xs text-white/60 font-light">100% Free! Participation, food, mentors, and swag are completely on us.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#0c1433]/30 p-5">
            <h4 className="font-tech text-xs font-bold text-white mb-1.5">VENUE</h4>
            <p className="text-xs text-white/60 font-light">Delhi Technological University (DTU), Shahbad Daulatpur, Main Bawana Road, Delhi.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
