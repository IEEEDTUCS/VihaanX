"use client";

export default function PrizesSection() {
  /*
  const prizes = [
    {
      rank: "02",
      title: "FIRST RUNNER-UP",
      reward: "₹50,000",
      badge: "SILVER ORBIT",
      color: "#94a3b8",
      perks: [
        "Cash Prize Pool",
        "Sponsored Cloud Credits",
        "Certificate of Merit",
        "Premium Swag Packs",
      ],
    },
    {
      rank: "01",
      title: "GRAND CHAMPION",
      reward: "₹1,00,000",
      badge: "GOLD APEX",
      color: "#fbbf24",
      highlight: true,
      perks: [
        "Grand Trophy & Cash Prize",
        "Direct Interview Opportunities",
        "Enterprise Cloud Credits",
        "Full Hardware Kits & Swag",
      ],
    },
    {
      rank: "03",
      title: "SECOND RUNNER-UP",
      reward: "₹30,000",
      badge: "BRONZE CREST",
      color: "#ea580c",
      perks: [
        "Cash Prize Pool",
        "Developer Tool Access",
        "Certificate of Merit",
        "Exclusive Vihaan Merch",
      ],
    },
  ];
  */

  return (
    <section
      id="prizes"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-[#070b19] overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/*Header Tag*/}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
          <span className="font-tech text-xs tracking-[0.3em] text-[#ff3b6c] uppercase">
            // REWARDS
          </span>
        </div>

        {/*Section Heading*/}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              PRIZES & RECOGNITION
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Details will be announced soon. Stay tuned for the official reveal.
            </p>
          </div>
          {/* <div className="text-xs font-mono text-amber-300/80 bg-amber-950/40 border border-amber-500/20 px-4 py-2 rounded-full self-start md:self-auto">
            TOTAL POOL: ₹5,00,000+
          </div> */}
        </div>

      {/*Podium Grid
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
          {prizes.map((p) => (
            <div
              key={p.rank}
              className={`relative flex flex-col justify-between rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
                p.highlight
                  ? "border-2 border-amber-400/70 bg-gradient-to-b from-[#1c1809]/80 via-[#0d132e]/90 to-[#070b19]/90 shadow-[0_0_50px_rgba(251,191,36,0.25)] md:-translate-y-4"
                  : "border border-white/10 bg-[#091129]/60 hover:border-white/30"
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
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-xs text-white/75 font-light"
                    >
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
        */}
        
        <div className="relative mx-auto flex min-h-[22rem] max-w-4xl items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0c1433]/70 via-[#091129]/50 to-[#170d2b]/70 shadow-[inset_0_0_70px_rgba(56,189,248,0.06)]">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute h-72 w-72 rounded-full border border-cyan-300/15 [transform:rotateX(66deg)_rotateZ(-18deg)] animate-[spin_18s_linear_infinite]">
            <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_#38bdf8]" />
          </div>
          <div className="absolute h-52 w-52 rounded-full border border-pink-300/20 [transform:rotateX(66deg)_rotateZ(28deg)] animate-[spin_12s_linear_infinite_reverse]">
            <span className="absolute left-1/2 -top-1 h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_14px_#ff3b6c]" />
          </div>
          <div className="absolute h-32 w-32 rounded-full border border-white/10 shadow-[0_0_45px_rgba(255,59,108,0.14),inset_0_0_30px_rgba(56,189,248,0.12)]" />
          <span className="absolute left-[18%] top-[28%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
          <span className="absolute right-[20%] top-[22%] h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] animate-pulse" />
          <span className="absolute bottom-[25%] left-[25%] h-1 w-1 rounded-full bg-pink-300 shadow-[0_0_10px_#ff3b6c] animate-pulse" />
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <span className="mb-5 flex items-center gap-3 font-mono text-[0.58rem] tracking-[0.3em] text-cyan-300/70">
              <span className="h-px w-8 bg-cyan-300/50" />
              REWARD DATA INCOMING
              <span className="h-px w-8 bg-cyan-300/50" />
            </span>
            <p className="font-tech text-2xl font-bold tracking-[0.16em] text-white transition-colors hover:text-[#ff3b6c] sm:text-4xl">
              TO BE REVEALED SOON
            </p>
            <span className="mt-5 h-px w-32 bg-gradient-to-r from-transparent via-[#ff3b6c] to-transparent shadow-[0_0_12px_#ff3b6c]" />
          </div>
        </div>
      </div>
    </section>
  );
}
