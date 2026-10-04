'use client';

import Countdown from '../Countdown/Countdown';

export default function Hero({ isLoaded, onPreviousEditions }) {
  const visible = isLoaded ? 'animate-fade-slide-up' : '';
  const sidebar = 'absolute top-1/2 z-[3] hidden flex-col gap-10 text-[.6rem] font-medium leading-[1.7] tracking-[.22em] text-[#8a8a9a] xl:flex';
  return (
    <section className="relative flex min-h-screen min-h-[100dvh] items-center justify-center overflow-hidden px-5 pb-24 pt-24 sm:px-8">
      <aside className={`${sidebar} left-10 -translate-y-1/2 ${visible}`} aria-hidden="true">
        <div><p>A DECADE</p><p>OF DREAMERS</p></div>
        <div className="mt-10"><p>TECHNOLOGY</p><p>FOR A BETTER</p><p>TOMORROW</p></div>
        <div className="mt-10"><p>PEOPLE</p><p>IDEAS</p><p>IMPACT</p></div>
      </aside>
      <aside className={`${sidebar} right-10 -translate-y-1/2 text-right ${visible}`} aria-hidden="true">
        <div><p>INNOVATE</p><p>BUILD</p><p>BELONG</p></div>
        <div className="mt-10"><p>IDEAS</p><p>BEYOND</p><p>LIMITS</p></div>
      </aside>

      <div className="z-[3] flex w-full max-w-[720px] flex-col items-center text-center">
        <p className={`mb-3 text-[.5rem] tracking-[.28em] text-[#8a8a9a] sm:text-[.8rem] ${visible}`}>PRESENTS THE 10TH EDITION OF</p>
        <div className={`relative inline-flex items-end ${visible}`}>
            <img src="/logos/vihaan_full.png" className="h-auto w-7xl" />
          {/*<h1 className="font-display text-[clamp(2.8rem,14vw,9rem)] font-bold leading-[.9] tracking-[.06em] text-[#f0f0f0]">VIHAAN</h1>*/}
          {/*<img src="/landingPage/X.svg" alt="" aria-hidden="true" width="280" height="320" className="absolute -bottom-[20%] -right-[18%] h-[95%] w-auto opacity-[.88] drop-shadow-[0_0_40px_rgba(124,58,237,.15)]" />*/}
        </div>
        <div className={`mt-5 flex items-center gap-2.5 text-[.45rem] tracking-[.22em] text-[#8a8a9a] sm:gap-3.5 sm:text-[.7rem] ${visible}`}>
          <span className="h-px w-5 shrink-0 bg-violet-400 sm:w-7" /><p>NORTH INDIA&apos;S LARGEST STUDENT-RUN HACKATHON</p><span className="h-px w-5 shrink-0 bg-violet-400 sm:w-7" />
        </div>
        <button type="button" onClick={onPreviousEditions} className={`mt-8 inline-flex items-center gap-2.5 rounded-full border border-violet-400 px-5 py-2.5 text-[.58rem] font-medium tracking-[.16em] text-[#f0f0f0] transition hover:-translate-y-px hover:bg-violet-400 hover:shadow-[0_0_28px_rgba(124,58,237,.35)] sm:px-8 sm:py-3 sm:text-[.7rem] ${visible}`}>PREVIOUS EDITIONS <span className="text-sm transition group-hover:translate-x-1">→</span></button>
        <div className={visible}><Countdown /></div>
      </div>

      {/* Astronaut — bottom-right, large, matches mockup */}
      <div className={`absolute bottom-0 right-0 z-[2] hidden pointer-events-none md:block ${visible}`}
        style={{ width: 'clamp(320px,42vw,640px)' }}>
        <img
          src="/landingPage/astronaut.png"
          alt="Astronaut sitting on the edge of a cliff, gazing at the cosmos"
          width="640" height="780"
          className="w-full animate-float"
          style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.6))' }}
        />
      </div>
    </section>
  );
}
