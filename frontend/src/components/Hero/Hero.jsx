'use client';

import AnimatedCountdown from '../ui/animated-countdown';
import Button from '../ui/Button';
import SpaceBackground from '../SpaceBackground/SpaceBackground';
import GlobeWrapper from '../Globe/GlobeWrapper';

const TARGET_DATE = '2026-11-14T00:00:00+05:30';

export default function Hero({ isLoaded, onPreviousEditions, onGlobeReady }) {
  const vis = isLoaded ? 'animate-fade-slide-up' : 'opacity-0';

  return (
    <section className="relative flex min-h-screen min-h-[100dvh] items-center justify-center overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
      
      {/* ── 1. Hero Isolated Space Background (Base bg, Stars, Top-Right 3D Planet) ── */}
      <SpaceBackground />

      {/* ── 2. Hero Isolated 3D Globe at Bottom-Left ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <GlobeWrapper onReady={onGlobeReady} />
      </div>

      {/* ── Left sidebar — all text stacked, top-left ── */}
      <aside
        className={`parallax-sidebar-left absolute left-4 top-20 z-[5] hidden flex-col gap-4 xl:flex ${vis}`}
        aria-hidden="true"
        style={{ maxWidth: '10rem' }}
      >
        {/* A DECADE OF DREAMERS */}
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-[0.68rem] font-bold leading-snug tracking-[0.22em] text-white/90 lg:text-[0.75rem]">A DECADE</p>
          <p className="font-display text-[0.68rem] font-bold leading-snug tracking-[0.22em] text-white/90 lg:text-[0.75rem]">OF DREAMERS</p>
        </div>

        {/* PEOPLE IDEAS IMPACT */}
        <div className="flex flex-col gap-0.5">
          <span className="mb-1.5 block h-px w-5 bg-[#e84a55]" />
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-white/70 lg:text-[0.75rem]">PEOPLE</p>
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-white/70 lg:text-[0.75rem]">IDEAS</p>
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-white/70 lg:text-[0.75rem]">IMPACT</p>
        </div>

        {/* INNOVATE BUILD BELONG — moved here from right */}
        <div className="flex flex-col gap-0.5 mt-2">
          <span className="mb-1.5 block h-px w-5 bg-[#e84a55]/50" />
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-white/60 lg:text-[0.75rem]">INNOVATE</p>
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-white/60 lg:text-[0.75rem]">BUILD</p>
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-white/60 lg:text-[0.75rem]">BELONG</p>
        </div>

        {/* Dot trail */}
        <div className="mt-2 flex flex-col gap-1.5">
          {[0,1,2,3,4].map(i => (
            <span key={i} className={`block rounded-full ${i===0?'h-1.5 w-1.5 bg-white/50':'h-1 w-1 bg-white/20'}`} />
          ))}
        </div>
      </aside>

      {/* ── Centre content ── */}
      <div className={`parallax-hero-content relative z-[5] flex w-full max-w-[min(680px,90vw)] flex-col items-center text-center ${vis}`}>

        {/* PRESENTS */}
        <p className="mb-1 text-[0.65rem] font-medium tracking-[0.35em] text-white/50
                       sm:text-[0.72rem] lg:text-[0.8rem]">
          PRESENTS
        </p>

        {/* THE 10TH EDITION OF */}
        <p className="mb-3 font-display text-[0.78rem] font-bold tracking-[0.16em] text-white/85
                       sm:text-[0.92rem] lg:text-[1.05rem]">
          THE 10TH EDITION OF
        </p>

        {/* VIHAAN X logo */}
        <div className="w-full">
          <img
            src="/logos/vihaan_full.png"
            alt="Vihaan X"
            className="h-auto w-full object-contain"
            style={{
              maxWidth: '100%',
              maxHeight: 'clamp(70px, 18vw, 200px)',
              minHeight: '60px',
            }}
          />
        </div>

        {/* NORTH INDIA'S LARGEST */}
        <div className="mt-4 flex w-full items-center justify-center gap-2 sm:gap-3">
          <span className="h-px w-6 shrink-0 bg-[#e84a55] sm:w-10" />
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-white/80
                         sm:text-[0.75rem] lg:text-[0.88rem]">
            NORTH INDIA&apos;S LARGEST STUDENT&#8209;RUN HACKATHON
          </p>
          <span className="h-px w-6 shrink-0 bg-[#e84a55] sm:w-10" />
        </div>

        {/* Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button href="/register" size="md" innerClassName="bg-black/70 backdrop-blur-sm font-display tracking-[0.12em] text-[0.6rem] sm:text-[0.65rem]">
            REGISTER NOW&nbsp;&rarr;
          </Button>
          <Button onClick={onPreviousEditions} size="md" innerClassName="bg-black/70 backdrop-blur-sm font-display tracking-[0.12em] text-[0.6rem] sm:text-[0.65rem]">
            PREVIOUS EDITIONS&nbsp;&rarr;
          </Button>
        </div>

        {/* IDEAS BEYOND LIMITS */}
        <p className="mt-4 font-display text-[0.58rem] font-medium tracking-[0.3em] text-white/40
                       sm:text-[0.64rem] lg:text-[0.7rem]">
          IDEAS BEYOND LIMITS
        </p>

        {/* Countdown */}
        <div className="mt-5 w-full">
          <AnimatedCountdown
            targetDate={TARGET_DATE}
            variant="modern"
            size="sm"
            containerClassName="border-white/[0.06] bg-black/20 backdrop-blur-xl w-full justify-center sm:size-md"
            unitClassName="border-white/[0.07] bg-white/[0.04]"
            numberClassName="text-white"
            labelClassName="text-white/40"
          />
        </div>

      </div>

      {/* ── Astronaut — bottom-right, responsive size ── */}
      <div
        className={`parallax-astronaut absolute bottom-0 right-0 z-[3] hidden pointer-events-none sm:block ${vis}`}
        style={{ width: 'clamp(160px, 22vw, 380px)' }}
      >
        <img
          src="/landingPage/astroanut.webp"
          alt="Astronaut sitting on rocks gazing at the cosmos"
          width="380" height="380"
          className="w-full"
          style={{ filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.7))' }}
        />
      </div>

      {/* ── Scroll indicator ── */}
      <div className={`absolute bottom-5 left-1/2 z-[5] hidden -translate-x-1/2 flex-col items-center gap-1.5 sm:flex ${vis}`}>
        <p className="text-[0.48rem] tracking-[0.3em] text-white/25 sm:text-[0.52rem]">SCROLL TO EXPLORE</p>
        <div className="flex h-6 w-4 items-start justify-center rounded-full border border-white/20 p-0.5">
          <span className="h-1.5 w-0.5 animate-bounce rounded-full bg-white/35" />
        </div>
      </div>

    </section>
  );
}
