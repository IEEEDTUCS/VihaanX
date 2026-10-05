'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const TIMELINE_EVENTS = [
  {
    id: 'arrival',
    step: '01',
    title: 'ARRIVAL',
    date: 'Nov 1, 2024',
    time: '09:30 AM – 11:30 AM',
    description: 'Check-in, kit collection, badge distribution and meet the community.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* 4-Point Cosmic Sparkle Star */}
        <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="1.5" fill="currentColor" fillOpacity="0.8" />
      </svg>
    ),
  },
  {
    id: 'ignition',
    step: '02',
    title: 'IGNITION',
    date: 'Nov 1, 2024',
    time: '12:00 PM – 01:30 PM',
    description: 'Inauguration ceremony, keynote address and official hacking kickoff.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Sleek Rocket Blasting 45deg */}
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.95 11a22.35 22.35 0 0 1-4.05 2z" strokeLinejoin="round" />
        <circle cx="15" cy="9" r="1.5" fill="currentColor" />
        <path d="M9 15l-3 3M15 9l3-3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ideation',
    step: '03',
    title: 'IDEATION',
    date: 'Nov 1, 2024',
    time: '01:30 PM – 03:00 PM',
    description: 'Brainstorming, problem breakdown and architecture blueprinting.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Glowing Compass / Ideation Spark */}
        <circle cx="12" cy="12" r="9" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'build',
    step: '04',
    title: 'BUILD',
    date: 'Nov 1, 2024',
    time: '03:00 PM onwards',
    description: 'Turn ambitious ideas into working prototypes with cloud credits.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* 3D Isometric Wireframe Cube */}
        <path d="M12 2.5L21 7.5V16.5L12 21.5L3 16.5V7.5L12 2.5Z" strokeLinejoin="round" />
        <path d="M12 12V21.5M12 12L21 7.5M12 12L3 7.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'checkpoint1',
    step: '05',
    title: 'CHECKPOINT 1',
    date: 'Nov 1, 2024',
    time: '08:00 PM – 09:30 PM',
    description: 'Initial progress review, mentor guidance and milestone sync.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Shield Checkmark */}
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'midnight',
    step: '06',
    title: 'MIDNIGHT BOOST',
    date: 'Nov 1 – Nov 2, 2024',
    time: '12:00 AM – 01:30 AM',
    description: 'Midnight energy recharge, arcade mini-games, side quests and coffee.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Lightning Energy Bolt */}
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'evolve',
    step: '07',
    title: 'EVOLVE',
    date: 'Nov 2, 2024',
    time: '04:00 AM – 08:00 AM',
    description: 'Deep technical mentorship, API integration and architectural refinement.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Connected Node Network */}
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5.5" cy="18" r="2.5" />
        <circle cx="18.5" cy="18" r="2.5" />
        <line x1="12" y1="7.5" x2="6.8" y2="15.8" />
        <line x1="12" y1="7.5" x2="17.2" y2="15.8" />
        <line x1="8" y1="18" x2="16" y2="18" />
      </svg>
    ),
  },
  {
    id: 'checkpoint2',
    step: '08',
    title: 'CHECKPOINT 2',
    date: 'Nov 2, 2024',
    time: '09:00 AM – 10:30 AM',
    description: 'Secondary evaluation, feasibility check and pitch deck prep.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Radar / Target Crosshair */}
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
        <line x1="12" y1="1" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="1" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="23" y2="12" />
      </svg>
    ),
  },
  {
    id: 'codefreeze',
    step: '09',
    title: 'CODE FREEZE',
    date: 'Nov 2, 2024',
    time: '12:00 PM Sharp',
    description: 'Repository lock, demo video submission and presentation staging.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Terminal / Lock Matrix */}
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'reveal',
    step: '10',
    title: 'REVEAL',
    date: 'Nov 2, 2024',
    time: '02:00 PM – 05:00 PM',
    description: 'Live grand finale pitches, jury evaluation, winner reveal and awards gala.',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {/* Futuristic Pennant Flag */}
        <path d="M5 21V3M5 4L18 8.5L5 13V4Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
];

export default function Timeline() {
  const [activeStep, setActiveStep] = useState(3); // Default to Step 04 (BUILD) matching mockup
  const [progress, setProgress] = useState(0.35);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const cardsListRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollBoostRef = useRef(0);
  const touchYRef = useRef(null);

  const totalSteps = TIMELINE_EVENTS.length;

  // Auto-scroll active card into comfortable view inside the right column list
  useEffect(() => {
    const activeEl = cardRefs.current[activeStep];
    const container = cardsListRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      
      // Calculate relative offset to center active card smoothly
      const currentScroll = container.scrollTop;
      const targetScroll =
        currentScroll +
        (elRect.top - containerRect.top) -
        (containerRect.height / 2 - elRect.height / 2);

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [activeStep]);

  // Scroll handler: updates active step and adds continuous forward progress to video on any scroll (up or down)
  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const currentY = window.scrollY;
    const deltaY = Math.abs(currentY - lastScrollYRef.current);
    lastScrollYRef.current = currentY;

    // Any scroll movement (up or down) accelerates video forward
    if (deltaY > 0) {
      scrollBoostRef.current += Math.min(deltaY * 0.005, 0.45);
    }

    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    const totalScrollable = sectionHeight - windowHeight;
    const currentScroll = -rect.top;

    let p = currentScroll / totalScrollable;
    p = Math.max(0, Math.min(1, p));
    setProgress(p);

    const currentIdx = Math.min(totalSteps - 1, Math.max(0, Math.floor(p * totalSteps * 0.9999)));
    setActiveStep(currentIdx);
  }, [totalSteps]);

  // Direct Wheel & Touch listeners for instant scroll-sensitivity
  useEffect(() => {
    const handleWheel = (e) => {
      const delta = Math.abs(e.deltaY);
      if (delta > 0) {
        scrollBoostRef.current += Math.min(delta * 0.004, 0.35);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0] && touchYRef.current !== null) {
        const delta = Math.abs(e.touches[0].clientY - touchYRef.current);
        touchYRef.current = e.touches[0].clientY;
        if (delta > 0) {
          scrollBoostRef.current += Math.min(delta * 0.006, 0.35);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Video continuous loop & scroll forward boost loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;
      if (video && video.duration && !isNaN(video.duration) && video.duration > 0) {
        // Apply forward scroll boost smoothly
        if (scrollBoostRef.current > 0.0005) {
          const step = Math.min(scrollBoostRef.current * 0.35, 0.22);
          video.currentTime = (video.currentTime + step) % video.duration;
          scrollBoostRef.current -= step;
        }

        // Keep video playing forward smoothly
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Step to index smoothly
  const scrollToStep = (idx) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;
    const totalScrollable = sectionHeight - windowHeight;

    const targetScroll = sectionTop + (idx / (totalSteps - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    setActiveStep(idx);
    scrollBoostRef.current += 0.35; // Advance video forward on step click
  };

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative z-20 w-full min-h-[600vh] bg-[#040209] text-white select-none"
      aria-label="Event Timeline"
    >
      {/* ── STICKY VIEWPORT CONTAINER ── */}
      <div className="sticky top-0 flex h-screen h-[100dvh] w-full items-center justify-center overflow-hidden">
        
        {/* ── 1. Cosmic Background (Base Planet & Nebula) ── */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            src="/timeline/timeline_base_bg.webp"
            alt="Cosmic ringed planet timeline background"
            className="h-full w-full object-cover object-left-bottom lg:object-center"
          />

          {/* ── 2. Scroll-Sensitive Foreground Video Overlay (Advances on ANY scroll) ── */}
          <video
            ref={videoRef}
            src="/timeline/scrollable.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            style={{
              mixBlendMode: 'screen',
              opacity: 0.88,
            }}
          />

          {/* ── 3. High-Contrast Vignettes & Gradient Horizon ── */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 95% 85% at 50% 50%, transparent 30%, rgba(4,2,9,0.5) 68%, rgba(4,2,9,0.94) 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #0a0a0f 0%, rgba(10,10,15,0.8) 55%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.8) 55%, transparent 100%)',
            }}
          />
        </div>

        {/* ── Main Content Grid (Elevated Top-Left Header & Right Timeline) ── */}
        <div className="relative z-20 mx-auto flex h-full max-w-[1520px] w-full flex-col justify-between px-4 py-4 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:gap-10 lg:px-12 lg:py-8">
          
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: Elevated Header (Positioned High for Visibility)   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div className="relative flex flex-col items-start justify-start pt-2 sm:pt-4 lg:self-start lg:pt-6 lg:max-w-[500px]">
            
            {/* Header Ambient Contrast Backing (Ensures 100% Crisp Visibility) */}
            <div
              className="pointer-events-none absolute -inset-6 rounded-3xl -z-10 opacity-70"
              style={{
                background: 'radial-gradient(ellipse at 30% 30%, rgba(4,2,10,0.85) 0%, transparent 75%)',
              }}
            />

            {/* Top Tag: VIHAANX • 10TH EDITION ──────── */}
            <div className="mb-2 flex items-center gap-2.5 sm:gap-3">
              <span className="font-display text-[0.66rem] sm:text-[0.78rem] font-bold tracking-[0.22em] uppercase text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                VIHAANX
              </span>
              <span className="text-[0.65rem] text-[#ff2d55]">•</span>
              <span className="font-display text-[0.66rem] sm:text-[0.78rem] font-bold tracking-[0.22em] uppercase text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                10TH EDITION
              </span>
              <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-white/50 to-transparent" />
            </div>

            {/* Framing Cyber Corner Bracket (Exact Mockup Match) */}
            <div className="relative pl-3.5 sm:pl-4.5">
              
              {/* Thin Left Cyber Border with Top Corner Hook */}
              <div className="absolute left-0 top-1 bottom-1 w-[1.5px] bg-gradient-to-b from-[#ff2d55] via-[#ff4d79]/50 to-transparent shadow-[0_0_8px_#ff2d55]">
                {/* Top Corner Hook */}
                <div className="absolute -top-1 left-0 h-1.5 w-3.5 border-t-[1.5px] border-l-[1.5px] border-[#ff2d55] shadow-[0_0_8px_#ff2d55]" />
              </div>

              {/* Section Index Badge: 05 ── */}
              <div className="mb-1 flex items-center gap-3">
                <span className="font-serif text-[0.85rem] font-black tracking-[0.24em] text-white/95 sm:text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  05
                </span>
                <span className="h-px w-10 bg-gradient-to-r from-white/45 to-transparent sm:w-16" />
              </div>

              {/* Main Heading: EVENT TIMELINE with Luminous 3D Orbit Ring */}
              <div className="relative mt-0.5">
                <h2 className="font-serif text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem] font-black tracking-[0.05em] text-white leading-[0.92] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
                  EVENT
                </h2>
                
                <div className="relative inline-block mt-0.5 sm:mt-1">
                  <h2 className="font-serif text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem] font-black tracking-[0.05em] bg-gradient-to-r from-[#ffa5b9] via-[#ff4d79] to-[#ff2d55] bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(255,77,121,1)] leading-[0.92]">
                    TIMELINE
                  </h2>

                  {/* Luminous 3D Orbital Ring Encircling TIMELINE (Exact Mockup Match) */}
                  <div
                    className="pointer-events-none absolute -inset-x-8 sm:-inset-x-10 top-1/2 -translate-y-1/2 h-11 sm:h-14 rounded-full border-[2px] border-[#ff4d79]/90 opacity-95"
                    style={{
                      transform: 'rotate(-12deg) rotateX(74deg)',
                      boxShadow: '0 0 30px rgba(255,77,109,0.9), inset 0 0 20px rgba(255,77,109,0.6)',
                    }}
                  />
                </div>
              </div>

              {/* Subtitle Tagline (Crystal Clear Legibility) */}
              <div className="mt-3.5 sm:mt-4.5 flex flex-col gap-0.5">
                <p className="font-body text-[0.66rem] sm:text-[0.78rem] font-bold tracking-[0.28em] text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  A 24-HOUR JOURNEY
                </p>
                <p className="font-body text-[0.66rem] sm:text-[0.78rem] font-bold tracking-[0.28em] text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  FROM IDEAS TO IMPACT
                </p>
              </div>

              {/* Interactive Step Badge */}
              <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="h-2 w-2 rounded-full bg-[#ff2d55] animate-pulse shadow-[0_0_10px_#ff2d55]" />
                <span className="font-serif text-[#ff4d79] font-black text-xs sm:text-sm">
                  {TIMELINE_EVENTS[activeStep].step}
                </span>
                <span className="text-white/40 text-xs">/</span>
                <span className="font-serif text-white/70 text-xs sm:text-sm">10</span>
                <span className="mx-1 text-white/25">•</span>
                <span className="font-body text-[0.6rem] sm:text-[0.68rem] tracking-[0.16em] uppercase text-white font-semibold">
                  {TIMELINE_EVENTS[activeStep].title}
                </span>
              </div>

            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: Futuristic Sci-Fi 10-Event Timeline Rail & Cards */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div className="relative flex w-full max-w-2xl flex-1 flex-col justify-center my-auto pt-2 lg:pt-0">
            
            {/* Scrollable Container with Smooth Focus & Custom Masking */}
            <div
              ref={cardsListRef}
              className="relative flex max-h-[68vh] sm:max-h-[74vh] flex-col gap-3 sm:gap-3.5 overflow-y-auto pl-12 sm:pl-16 pr-1 sm:pr-2 py-2 scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
              }}
            >
              
              {/* Vertical Glowing Rail Line */}
              <div
                className="absolute left-4 sm:left-5 top-2 bottom-2 w-[1.5px] pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,77,109,0.15) 0%, rgba(255,77,109,0.9) 50%, rgba(255,77,109,0.15) 100%)',
                  boxShadow: '0 0 12px rgba(255,77,109,0.6)',
                }}
              />

              {TIMELINE_EVENTS.map((item, idx) => {
                const isActive = idx === activeStep;

                return (
                  <div
                    key={item.id}
                    ref={(el) => (cardRefs.current[idx] = el)}
                    onClick={() => scrollToStep(idx)}
                    className="group relative flex items-center cursor-pointer select-none transition-all duration-300"
                  >
                    {/* ── Checkpoint Node on the left rail (• 01, • 02, ◉ 03, etc.) ── */}
                    <div className="absolute -left-12 sm:-left-16 flex items-center gap-2 sm:gap-2.5 z-20">
                      
                      {/* Node Circle on the Line */}
                      <div className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center">
                        {/* Concentric Radar Ping on Active Step */}
                        {isActive && (
                          <>
                            <span className="absolute -inset-1.5 rounded-full bg-[#ff2d55]/40 animate-ping" />
                            <span className="absolute inset-0 rounded-full border border-[#ff2d55] shadow-[0_0_14px_#ff2d55]" />
                          </>
                        )}
                        <span
                          className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                            isActive
                              ? 'h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white shadow-[0_0_16px_#ffffff]'
                              : 'h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white/40 group-hover:bg-white/90 group-hover:scale-125'
                          }`}
                        />
                      </div>

                      {/* Step Number Badge beside the dot */}
                      <span
                        className={`font-serif text-[0.82rem] sm:text-base font-bold tracking-[0.16em] transition-all duration-300 ${
                          isActive
                            ? 'text-[#ff2d55] scale-110 drop-shadow-[0_0_16px_rgba(255,45,85,1)] font-black'
                            : 'text-white/45 group-hover:text-white/85'
                        }`}
                      >
                        {item.step}
                      </span>
                    </div>

                    {/* ── Futuristic Cyberpunk Glassmorphism Card (Exact Mockup Match) ── */}
                    <div
                      className={`relative flex w-full items-center justify-between gap-3 sm:gap-4.5 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 transition-all duration-400 overflow-hidden ${
                        isActive
                          ? 'border-[1.5px] border-[#ff2d55] bg-[#0d0918]/92 shadow-[0_0_38px_rgba(255,45,85,0.48)] scale-[1.01]'
                          : 'border border-white/10 bg-[#070510]/72 hover:border-white/25 hover:bg-[#070510]/90'
                      }`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                      }}
                    >
                      {/* Top Right Tech Notch Accent Line */}
                      <div
                        className={`pointer-events-none absolute right-2 top-0 h-[2px] w-12 transition-all duration-300 ${
                          isActive ? 'bg-[#ff4d79] shadow-[0_0_10px_#ff4d79]' : 'bg-white/20'
                        }`}
                      />

                      {/* Active Card Interior Crimson Ambient Wash */}
                      {isActive && (
                        <div
                          className="pointer-events-none absolute inset-0 opacity-30"
                          style={{
                            background: 'radial-gradient(ellipse 90% 80% at 20% 50%, rgba(255,45,85,0.7) 0%, transparent 75%)',
                          }}
                        />
                      )}

                      {/* Left: Square Icon Tile Box */}
                      <div
                        className={`flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-300 ${
                          isActive
                            ? 'border-[#ff2d55] bg-[#ff2d55]/15 text-[#ff4d79] shadow-[0_0_20px_rgba(255,45,85,0.55)]'
                            : 'border-white/15 bg-white/[0.04] text-white/70 group-hover:border-white/30 group-hover:text-white'
                        }`}
                      >
                        {item.icon}
                      </div>

                      {/* Middle: Content Info */}
                      <div className="flex flex-1 flex-col justify-center min-w-0 pr-1 sm:pr-2">
                        {/* Event Title (Bold Serif Tracking) */}
                        <h3
                          className={`font-serif text-[0.98rem] sm:text-[1.18rem] font-black tracking-[0.16em] uppercase transition-colors duration-300 leading-tight ${
                            isActive
                              ? 'text-[#ff4d79] drop-shadow-[0_0_18px_rgba(255,77,121,0.9)]'
                              : 'text-white group-hover:text-white/95'
                          }`}
                        >
                          {item.title}
                        </h3>

                        {/* Meta Row: Date & Time */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-0.5 text-[0.62rem] sm:text-[0.72rem] font-medium tracking-[0.04em] text-white/60">
                          {/* Date with Pink Calendar Icon */}
                          <span className="inline-flex items-center gap-1.5">
                            <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ff4d79] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span className="text-white/90">{item.date}</span>
                          </span>

                          {/* Time with Pink Clock Icon */}
                          <span className="inline-flex items-center gap-1.5">
                            <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ff4d79] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="text-white/90">{item.time}</span>
                          </span>
                        </div>

                        {/* Subtext Description */}
                        <p className="mt-1 line-clamp-1 font-body text-[0.62rem] sm:text-[0.72rem] font-normal leading-relaxed text-white/75">
                          {item.description}
                        </p>
                      </div>

                      {/* Right: Circular Action Arrow */}
                      <div
                        className={`flex h-7 w-7 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isActive
                            ? 'border-[#ff2d55] bg-[#ff2d55]/25 text-[#ff4d79] shadow-[0_0_16px_rgba(255,45,85,0.7)] scale-105'
                            : 'border-white/20 bg-white/[0.02] text-white/40 group-hover:border-white/50 group-hover:text-white'
                        }`}
                      >
                        <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
