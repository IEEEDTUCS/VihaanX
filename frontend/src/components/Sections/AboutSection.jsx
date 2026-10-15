'use client';

export default function AboutSection() {
  const stats = [
    { label: 'EDITION', value: '10TH', detail: 'A Decade of Innovation' },
    { label: 'HACKING SPRINT', value: '24 HRS', detail: 'Non-stop Building' },
    { label: 'PARTICIPANTS', value: '2500+', detail: 'Pan-India Reach' },
    { label: 'PRIZE POOL', value: '₹5L+', detail: 'Cash & Tech Bounties' },
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-gradient-to-b from-[#070b19] via-[#091129] to-[#070b19] overflow-hidden"
    >
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 59, 108, 0.15) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
          <span className="font-tech text-xs tracking-[0.3em] text-[#ff3b6c] uppercase">
            // MISSION BRIEFING
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              ABOUT VIHAAN X
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Organized by IEEE DTU, Vihaan stands as North India&apos;s most prestigious student-driven hackathon. A platform built for visionary engineers to solve pressing challenges.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/20 px-4 py-2 rounded-full">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>COSMIC TELEMETRY ACTIVE</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative rounded-2xl border border-white/10 bg-[#0c1433]/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#ff3b6c]/50 hover:shadow-[0_0_24px_rgba(255,59,108,0.25)] hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                <div className="absolute transform rotate-45 bg-[#ff3b6c]/20 w-12 h-1 -top-2 -right-4" />
              </div>
              <p className="text-[0.62rem] font-tech font-bold tracking-[0.24em] text-white/50 mb-2">
                {s.label}
              </p>
              <p className="font-tech text-3xl sm:text-4xl font-black text-white group-hover:text-[#ff3b6c] transition-colors">
                {s.value}
              </p>
              <p className="text-xs text-white/60 mt-1 font-light">
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Narrative Box */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c1433]/70 via-[#0e1940]/60 to-[#0c1433]/70 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-[#ff3b6c]/10 blur-3xl pointer-events-none" />
          <h3 className="font-tech text-xl sm:text-2xl font-bold text-white mb-4">
            A Decade of Pioneering Curiosity
          </h3>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed font-light mb-6">
            For 10 iterations, Vihaan has provided students with the mentorship, cloud infrastructure, and community needed to turn bold ideas into high-impact software and hardware solutions. Whether diving deep into artificial intelligence or crafting decentralized autonomous architectures, this edition marks our grandest leap forward.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300">
              #StudentDriven
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              #TechInnovation
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">
              #IEEEDTU
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
