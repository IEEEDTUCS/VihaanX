'use client';

export default function TracksSection() {
  const tracks = [
    {
      id: '01',
      title: 'AI & MACHINE LEARNING',
      subtitle: 'Autonomous Intelligence',
      icon: '🧠',
      color: '#ff3b6c',
      desc: 'Build foundational models, multimodal agent systems, computer vision workflows, and intelligent automated tools.',
      tags: ['LLMs', 'Computer Vision', 'Agents', 'Neural Networks'],
    },
    {
      id: '02',
      title: 'WEB3 & DECENTRALIZATION',
      subtitle: 'Decentralized Networks',
      icon: '⛓️',
      color: '#38bdf8',
      desc: 'Smart contracts, zero-knowledge proofs, DeFi protocols, decentralized identity, and cross-chain dApps.',
      tags: ['ZK-Rollups', 'Smart Contracts', 'DeFi', 'Cross-chain'],
    },
    {
      id: '03',
      title: 'HEALTHCARE & BIO-TECH',
      subtitle: 'Life Sciences & Diagnostics',
      icon: '🧬',
      color: '#34d399',
      desc: 'Predictive health analytics, tele-medicine frameworks, biomedical signal processing, and medical accessibility apps.',
      tags: ['Diagnostics', 'Tele-Health', 'Wearables', 'Bio-Informatics'],
    },
    {
      id: '04',
      title: 'FINTECH & CYBER SECURITY',
      subtitle: 'Secure Ledger Systems',
      icon: '🛡️',
      color: '#fbbf24',
      desc: 'Next-gen fraud detection engines, secure cryptographic primitives, automated micro-investments, and privacy tech.',
      tags: ['Cryptography', 'Fraud Detection', 'Micro-Pay', 'Security'],
    },
    {
      id: '05',
      title: 'IOT & SMART EMBEDDED',
      subtitle: 'Hardware Arrays',
      icon: '🛰️',
      color: '#a855f7',
      desc: 'Microcontrollers, sensor telemetry, edge robotics, smart cities, and low-latency communication mesh devices.',
      tags: ['Edge AI', 'Robotics', 'Sensors', 'Embedded C++'],
    },
    {
      id: '06',
      title: 'OPEN INNOVATION',
      subtitle: 'Uncharted Horizons',
      icon: '🚀',
      color: '#f43f5e',
      desc: 'Have an extraordinary solution that defies categorization? Build anything impactful that disrupts traditional barriers.',
      tags: ['Moonshots', 'Accessibility', 'EdTech', 'Social Impact'],
    },
  ];

  return (
    <section
      id="tracks"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-gradient-to-b from-[#070b19] via-[#080d21] to-[#070b19] overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
          <span className="font-tech text-xs tracking-[0.3em] text-[#ff3b6c] uppercase">
            // DOMAINS OF INNOVATION
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              HACKATHON TRACKS
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Choose your mission trajectory. Each track is curated with distinct judging criteria, mentor pools, and exclusive bounties.
            </p>
          </div>
          <div className="text-xs font-mono text-white/40 border border-white/10 px-4 py-2 rounded-full self-start md:self-auto">
            6 MISSION SECTORS
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0c1433]/50 p-7 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,59,108,0.15)] hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{track.icon}</span>
                  <span className="font-tech text-xs font-bold tracking-widest text-white/40">
                    SECTOR {track.id}
                  </span>
                </div>
                <h3 className="font-tech text-lg font-bold tracking-wider text-white group-hover:text-[#ff3b6c] transition-colors mb-1">
                  {track.title}
                </h3>
                <p className="text-xs font-mono text-white/50 tracking-wider mb-4">
                  {track.subtitle}
                </p>
                <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
                  {track.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {track.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[0.62rem] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
