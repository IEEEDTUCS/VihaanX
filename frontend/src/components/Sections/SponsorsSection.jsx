"use client";

export default function SponsorsSection() {
  const sponsors = [
    { name: "IEEE DTU", tier: "ORGANIZING BODY", badge: "HOST" },
    {
      name: "DELHI TECHNOLOGICAL UNIVERSITY",
      tier: "PATRON UNIVERSITY",
      badge: "CAMPUS",
    },
    { name: "UNSTOP", tier: "PLATFORM PARTNER", badge: "REGISTRATION" },
    { name: "GITHUB", tier: "DEVELOPER TOOLING", badge: "CLOUD" },
    {
      name: "MAJOR LEAGUE HACKING",
      tier: "ALLIED ECOSYSTEM",
      badge: "COMMUNITY",
    },
    { name: "POLYGON", tier: "TRACK PARTNER", badge: "WEB3" },
  ];

  return (
    <section
      id="sponsors"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-gradient-to-b from-[#070b19] via-[#091129] to-[#070b19] overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-purple-400 shadow-[0_0_8px_#c084fc]" />
          <span className="font-tech text-xs tracking-[0.3em] text-purple-400 uppercase">
            // ALLIED PARTNERS
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              SPONSORS & PARTNERS
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Powering the frontier of student innovation. Supported by
              prominent institutions, developer platforms, and engineering
              brands.
            </p>
          </div>
          <a
            href="mailto:contact@ieeedtu.in?subject=Vihaan%20X%20Sponsorship%20Inquiry"
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-950/40 px-6 py-2.5 text-xs font-bold tracking-widest text-purple-300 hover:border-purple-400 hover:bg-purple-500/20 transition-all self-start md:self-auto"
          >
            <span>BECOME A SPONSOR</span>
            <span>&rarr;</span>
          </a>
        </div>

        {/* Sponsor Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {sponsors.map((sp, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0c1433]/40 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-[0_0_24px_rgba(192,132,252,0.18)] hover:-translate-y-1"
            >
              <span className="text-[0.6rem] font-mono tracking-widest text-purple-300/60 mb-2 uppercase border border-purple-400/20 px-2.5 py-0.5 rounded-full">
                {sp.badge}
              </span>
              <h3 className="font-tech text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-purple-300 transition-colors">
                {sp.name}
              </h3>
              <p className="text-[0.65rem] font-mono tracking-wider text-white/40 mt-1 uppercase">
                {sp.tier}
              </p>
            </div>
          ))}
        </div>

        {/* Sponsorship Callout */}
        <div className="rounded-2xl border border-white/10 bg-[#091129]/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-tech text-lg font-bold text-white mb-1">
              Want to partner with Vihaan X?
            </h4>
            <p className="text-xs sm:text-sm text-white/60 font-light max-w-lg">
              Gain visibility with 2,500+ top engineering candidates across
              India. Access tailored tech bounties, mentorship, and branding
              sessions.
            </p>
          </div>
          <a
            href="mailto:contact@ieeedtu.in"
            className="rounded-full bg-white px-6 py-2.5 text-xs font-bold tracking-widest text-slate-900 hover:bg-[#ff3b6c] hover:text-white transition-all shrink-0"
          >
            GET BROCHURE
          </a>
        </div>
      </div>
    </section>
  );
}
