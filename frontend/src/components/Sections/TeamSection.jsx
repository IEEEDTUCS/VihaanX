"use client";

export default function TeamSection() {
  const teams = [
    {
      name: "LEADERSHIP",
      role: "Mission Commanders",
      count: "Executive Council",
      icon: "⚡",
    },
    {
      name: "TECHNICAL LEAD",
      role: "System Engineers",
      count: "Platform & Judging",
      icon: "💻",
    },
    {
      name: "CREATIVE & DESIGN",
      role: "Visual Architects",
      count: "UI/UX & Branding",
      icon: "🎨",
    },
    {
      name: "CORPORATE RELATIONS",
      role: "Alliance Officers",
      count: "Sponsors & Mentors",
      icon: "🤝",
    },
    {
      name: "LOGISTICS & OPERATIONS",
      role: "Base Station Ops",
      count: "Event Experience",
      icon: "🛰️",
    },
    {
      name: "PUBLICITY & OUTREACH",
      role: "Transmission Relay",
      count: "Social & Media",
      icon: "📢",
    },
  ];

  return (
    <section
      id="team"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-[#070b19] overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
          <span className="font-tech text-xs tracking-[0.3em] text-[#ff3b6c] uppercase">
            // CREW & COMMAND
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              ORGANIZING CREW
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Meet the student organizers from IEEE DTU dedicating months to
              make Vihaan X an unforgettable launchpad for innovators.
            </p>
          </div>
          <div className="text-xs font-mono text-white/40 border border-white/10 px-4 py-2 rounded-full self-start md:self-auto">
            IEEE DTU STUDENT BODY
          </div>
        </div>

        {/* Team Wings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {teams.map((t, idx) => (
            <div
              key={idx}
              className="group relative flex items-start gap-4 rounded-3xl border border-white/10 bg-[#0c1433]/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#ff3b6c]/50 hover:shadow-[0_0_24px_rgba(255,59,108,0.18)] hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl group-hover:scale-110 transition-transform">
                {t.icon}
              </div>
              <div>
                <span className="text-[0.62rem] font-mono tracking-widest text-[#ff3b6c] font-bold uppercase">
                  {t.role}
                </span>
                <h3 className="font-tech text-base font-bold tracking-wider text-white group-hover:text-[#ff3b6c] transition-colors mt-0.5">
                  {t.name}
                </h3>
                <p className="text-xs text-white/50 font-light mt-1">
                  {t.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
