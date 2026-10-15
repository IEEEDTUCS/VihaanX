'use client';

export default function GallerySection() {
  const editions = [
    {
      year: 'VIHAAN 09',
      theme: 'Quantum Horizons',
      date: '2024 Edition',
      link: 'https://9.vihaan.ieeedtu.in/',
      desc: 'Over 2,200 registrations, 65 prototype submissions, and groundbreaking projects in generative AI and cloud infrastructure.',
    },
    {
      year: 'VIHAAN 08',
      theme: 'Cybernetic Evolution',
      date: '2023 Edition',
      link: 'https://9.vihaan.ieeedtu.in/',
      desc: 'A 24-hour hybrid hackathon pushing the frontiers of Web3, edge computing, and accessible assistive hardware.',
    },
    {
      year: 'VIHAAN 07',
      theme: 'Infinite Realities',
      date: '2022 Edition',
      link: 'https://9.vihaan.ieeedtu.in/',
      desc: 'Uniting passionate engineering minds across top national universities with extensive mentor reviews.',
    },
  ];

  return (
    <section
      id="gallery"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-24 bg-[#070b19] overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          <span className="font-tech text-xs tracking-[0.3em] text-cyan-400 uppercase">
            // HISTORICAL ARCHIVES
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              EVENT GALLERY
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Explore footprints from our previous editions. Relive the keynote speeches, midnight code sprints, and prize ceremonies.
            </p>
          </div>
          <a
            href="https://9.vihaan.ieeedtu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-5 py-2.5 text-xs font-bold tracking-widest text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all self-start md:self-auto"
          >
            <span>EXPLORE VIHAAN 09 SITE</span>
            <span>&rarr;</span>
          </a>
        </div>

        {/* Edition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editions.map((ed, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#091129]/60 p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono tracking-widest text-[#ff3b6c] font-bold">
                    {ed.date}
                  </span>
                  <span className="text-[0.62rem] font-mono tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                    ARCHIVED
                  </span>
                </div>
                <h3 className="font-tech text-2xl font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  {ed.year}
                </h3>
                <p className="text-xs font-mono text-white/50 tracking-wider mb-4">
                  {ed.theme}
                </p>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-6">
                  {ed.desc}
                </p>
              </div>

              <a
                href={ed.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors pt-4 border-t border-white/5"
              >
                <span>VIEW TRANSMISSION ARCHIVE</span>
                <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
