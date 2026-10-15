'use client';

export default function PrizesSection() {
  const prizes = [
    {
      rank: '02',
      title: 'FIRST RUNNER-UP',
      reward: '₹50,000',
      badge: 'SILVER ORBIT',
      color: '#94a3b8',
      perks: ['Cash Prize Pool', 'Sponsored Cloud Credits', 'Certificate of Merit', 'Premium Swag Packs'],
    },
    {
      rank: '01',
      title: 'GRAND CHAMPION',
      reward: '₹1,00,000',
      badge: 'GOLD APEX',
      color: '#fbbf24',
      highlight: true,
      perks: ['Grand Trophy & Cash Prize', 'Direct Interview Opportunities', 'Enterprise Cloud Credits', 'Full Hardware Kits & Swag'],
    },
    {
      rank: '03',
      title: 'SECOND RUNNER-UP',
      reward: '₹30,000',
      badge: 'BRONZE CREST',
      color: '#ea580c',
      perks: ['Cash Prize Pool', 'Developer Tool Access', 'Certificate of Merit', 'Exclusive Vihaan Merch'],
    },
  ];

  return (
    <section
      id="prizes"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-[#070b19] overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
          <span className="font-tech text-xs tracking-[0.3em] text-amber-400 uppercase">
            // REWARDS & BOUNTIES
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              PRIZES & RECOGNITION
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Substantial cash rewards, venture introductions, internship pipelines, and credits sponsored by our technology partners.
            </p>
          </div>
          <div className="text-xs font-mono text-amber-300/80 bg-amber-950/40 border border-amber-500/20 px-4 py-2 rounded-full self-start md:self-auto">
            TOTAL POOL: ₹5,00,000+
          </div>
        </div>

        {/* Podium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
          {prizes.map((p) => (
            <div
              key={p.rank}
              className={`relative flex flex-col justify-between rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
                p.highlight
                  ? 'border-2 border-amber-400/70 bg-gradient-to-b from-[#1c1809]/80 via-[#0d132e]/90 to-[#070b19]/90 shadow-[0_0_50px_rgba(251,191,36,0.25)] md:-translate-y-4'
                  : 'border border-white/10 bg-[#091129]/60 hover:border-white/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-tech text-xs font-bold tracking-widest text-white/40">
                    PODIUM {p.rank}
                  </span>
                  <span
                    className="text-[0.62rem] font-mono tracking-widest px-2.5 py-1 rounded-full font-bold uppercase"
                    style={{ backgroundColor: `${p.color}20`, color: p.color }}
                  >
                    {p.badge}
                  </span>
                </div>

                <h3 className="font-tech text-lg font-bold tracking-wider text-white mb-2">
                  {p.title}
                </h3>
                <p className="font-tech text-4xl font-black text-white tracking-tight mb-6">
                  {p.reward}
                </p>

                <ul className="space-y-3 mb-8">
                  {p.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-white/75 font-light">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b6c] shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/5 text-[0.68rem] font-mono text-white/40 tracking-wider">
                CERTIFICATE & SWAG INCLUDED
              </div>
            </div>
          ))}
        </div>

        {/* Special Category Bounties */}
        <div className="rounded-2xl border border-white/10 bg-[#091129]/40 p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌟</span>
            <div>
              <p className="text-xs font-bold tracking-wider text-white">
                SPECIAL TRACK BOUNTIES & ALL-WOMEN TEAM AWARDS
              </p>
              <p className="text-[0.7rem] text-white/50">
                Additional cash prizes & domain awards will be unveiled during team onboarding.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#ff3b6c] font-bold tracking-widest">
            MORE DETAILS SOON
          </span>
        </div>

      </div>
    </section>
  );
}
