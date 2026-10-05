'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const TIMELINE_EVENTS = [
  {
    id: 'arrival',
    step: '01',
    title: 'ARRIVAL',
    date: 'Nov 1, 2024',
    time: '09:30 AM – 11:30 AM',
    location: 'Main Reception & Welcome Deck',
    tag: 'REGISTRATION',
    highlights: ['Welcome Kit & Swags', 'ID Badges', 'Team Wi-Fi Setup', 'Networking'],
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
    location: 'Grand Auditorium & Live Stream',
    tag: 'CEREMONY',
    highlights: ['Opening Keynote', 'Track & Problem Reveal', 'Sponsor Bounty Briefing', 'Hacking Begins'],
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
    location: 'Hacking Arena & Workstations',
    tag: 'ARCHITECTURE',
    highlights: ['Problem Scoping', 'Architecture Wireframing', 'Tech Stack Finalization', 'Cloud Credits Activation'],
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
    location: 'Main Arena',
    tag: 'HACKING SPRINT',
    highlights: ['Core Logic Implementation', 'API Integrations', 'Frontend Scaffolding', 'Continuous Deployment'],
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
    location: 'Mentor Pods & Discord',
    tag: 'EVALUATION',
    highlights: ['Feasibility Review', 'Mentor Guidance', 'Pivot Assessment', 'Dinner Served'],
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
    location: 'Recreation Zone & Cafeteria',
    tag: 'ACTIVITIES',
    highlights: ['Midnight Pizza & Energy Drinks', 'Arcade Side Quests', 'Typing Speed Battle', 'DJ Ambient Set'],
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
    location: 'Mentorship Lounges',
    tag: 'REFINEMENT',
    highlights: ['Deep Code Reviews', 'Edge Case Fixes', 'UI/UX Polish', 'Morning Coffee & Breakfast'],
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
    location: 'Pitch Preparation Labs',
    tag: 'ROUND 2',
    highlights: ['Technical Validation', 'Pitch Deck Coaching', 'Demo Environment Check', 'Final Polish'],
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
    location: 'Devfolio Portal',
    tag: 'SUBMISSION',
    highlights: ['GitHub Repository Lock', 'Demo Video Upload', 'Project Page Publishing', 'Jury Docket Finalized'],
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
    location: 'Main Stage & Global Stream',
    tag: 'FINALE',
    highlights: ['Top 10 Live Pitches', 'VC & Industry Jury Q&A', 'Category Awards', 'Prize Pool Distribution'],
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
  const [activeStep, setActiveStep] = useState(3); // Step 04 (BUILD)
  const [selectedEvent, setSelectedEvent] = useState(null); // Modal detail view
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const cardsListRef = useRef(null);
  const cardRefs = useRef([]);
  const lastWheelTimeRef = useRef(0);
  const touchStartRef = useRef(null);
  const lastTouchTimeRef = useRef(0);
  const playbackTimeoutRef = useRef(null);

  const totalSteps = TIMELINE_EVENTS.length;

  // Video scrub & forward acceleration on ANY scroll/action
  const advanceVideo = useCallback((amount = 0.85) => {
    const video = videoRef.current;
    if (!video) return;

    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      video.currentTime = (video.currentTime + amount) % video.duration;
    }

    // Dynamic speed surge for immediate tactile feedback
    video.playbackRate = 2.4;
    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    playbackTimeoutRef.current = setTimeout(() => {
      if (video) video.playbackRate = 1.0;
    }, 380);

    if (video.paused) {
      video.play().catch(() => {});
    }
  }, []);

  // Video continuous loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    };
  }, []);

  // Smoothly center the active card inside the right container
  useEffect(() => {
    const activeEl = cardRefs.current[activeStep];
    const container = cardsListRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();

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

  // Step to specific index
  const goToStep = (idx) => {
    setActiveStep(idx);
    advanceVideo(0.85);
  };

  const nextStep = () => {
    if (activeStep < totalSteps - 1) {
      goToStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      goToStep(activeStep - 1);
    }
  };

  // Keyboard navigation (ArrowDown / ArrowUp / J / K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= 200 && rect.bottom >= window.innerHeight - 200;
      if (!inView) return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        if (activeStep < totalSteps - 1) {
          e.preventDefault();
          nextStep();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        if (activeStep > 0) {
          e.preventDefault();
          prevStep();
        }
      } else if (e.key === 'Escape') {
        setSelectedEvent(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, totalSteps]);

  // Smart Wheel Navigation: 1 scroll down = next event, 1 scroll up = prev event
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e) => {
      if (selectedEvent) return; // Allow normal modal scrolling

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      const isCenteredInView = rect.top <= 120 && rect.bottom >= windowH - 120;
      if (!isCenteredInView) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 16) return;

      const now = Date.now();

      // Debounce window for 1-scroll-per-event precision
      if (now - lastWheelTimeRef.current < 360) {
        if ((delta > 0 && activeStep < totalSteps - 1) || (delta < 0 && activeStep > 0)) {
          e.preventDefault();
        }
        return;
      }

      if (delta > 0) {
        // Scroll DOWN -> Next Event
        if (activeStep < totalSteps - 1) {
          e.preventDefault();
          lastWheelTimeRef.current = now;
          setActiveStep((prev) => {
            const next = Math.min(totalSteps - 1, prev + 1);
            advanceVideo(0.85);
            return next;
          });
        }
        // At last step, lets natural page scroll proceed to next section!
      } else if (delta < 0) {
        // Scroll UP -> Previous Event (Video STILL proceeds forward as requested!)
        if (activeStep > 0) {
          e.preventDefault();
          lastWheelTimeRef.current = now;
          setActiveStep((prev) => {
            const previous = Math.max(0, prev - 1);
            advanceVideo(0.85);
            return previous;
          });
        }
        // At first step, lets natural page scroll proceed to previous section!
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (selectedEvent || touchStartRef.current === null) return;
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const isCenteredInView = rect.top <= 120 && rect.bottom >= windowH - 120;
      if (!isCenteredInView) return;

      const currentY = e.touches[0].clientY;
      const diff = touchStartRef.current - currentY;
      const now = Date.now();

      if (Math.abs(diff) < 32) return;

      if (now - lastTouchTimeRef.current < 360) {
        if ((diff > 0 && activeStep < totalSteps - 1) || (diff < 0 && activeStep > 0)) {
          e.preventDefault();
        }
        return;
      }

      if (diff > 0) {
        // Swipe UP (Scroll down)
        if (activeStep < totalSteps - 1) {
          e.preventDefault();
          lastTouchTimeRef.current = now;
          touchStartRef.current = currentY;
          setActiveStep((prev) => {
            const next = Math.min(totalSteps - 1, prev + 1);
            advanceVideo(0.85);
            return next;
          });
        }
      } else if (diff < 0) {
        // Swipe DOWN (Scroll up)
        if (activeStep > 0) {
          e.preventDefault();
          lastTouchTimeRef.current = now;
          touchStartRef.current = currentY;
          setActiveStep((prev) => {
            const previous = Math.max(0, prev - 1);
            advanceVideo(0.85);
            return previous;
          });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeStep, totalSteps, advanceVideo, selectedEvent]);

  // Calculate rail active laser height percentage
  const laserFillPercentage = totalSteps > 1 ? (activeStep / (totalSteps - 1)) * 100 : 0;

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative z-20 flex min-h-screen h-screen h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#040209] text-white select-none"
      aria-label="Event Timeline"
    >
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
          className="absolute inset-x-0 top-0 h-28 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #0a0a0f 0%, rgba(10,10,15,0.8) 55%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
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
            className="pointer-events-none absolute -inset-6 rounded-3xl -z-10 opacity-75"
            style={{
              background: 'radial-gradient(ellipse at 30% 30%, rgba(4,2,10,0.9) 0%, transparent 75%)',
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

            {/* Interactive Step Badge & Controls */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
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

              {/* Prev / Next Quick Nav Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-md transition-all ${
                    activeStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#ff4d79] hover:text-[#ff4d79] hover:scale-110 active:scale-95'
                  }`}
                  aria-label="Previous event"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={activeStep === totalSteps - 1}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-md transition-all ${
                    activeStep === totalSteps - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#ff4d79] hover:text-[#ff4d79] hover:scale-110 active:scale-95'
                  }`}
                  aria-label="Next event"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Micro-Hint */}
            <div className="mt-3 hidden sm:flex items-center gap-2 text-[0.55rem] font-mono tracking-wider text-white/40">
              <span className="inline-block rounded border border-white/20 px-1 py-0.5">SCROLL</span>
              <span>or</span>
              <span className="inline-block rounded border border-white/20 px-1 py-0.5">↑ / ↓</span>
              <span>to navigate</span>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN: Futuristic Sci-Fi 10-Event Timeline Rail & Cards */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="relative flex w-full max-w-2xl flex-1 flex-col justify-center my-auto pt-2 lg:pt-0">
          
          {/* Scrollable Container with Smooth Auto-Centering */}
          <div
            ref={cardsListRef}
            className="relative flex max-h-[68vh] sm:max-h-[74vh] flex-col gap-3 sm:gap-3.5 overflow-y-auto pl-12 sm:pl-16 pr-1 sm:pr-2 py-2 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
          >
            
            {/* Background Base Rail Line */}
            <div className="absolute left-4 sm:left-5 top-2 bottom-2 w-[1.5px] bg-white/10 pointer-events-none" />

            {/* Dynamic Active Laser Rail Fill */}
            <div
              className="absolute left-4 sm:left-5 top-2 w-[2px] transition-all duration-400 ease-out pointer-events-none"
              style={{
                height: `${Math.max(2, laserFillPercentage)}%`,
                background: 'linear-gradient(to bottom, #ff2d55 0%, #ff4d79 100%)',
                boxShadow: '0 0 14px #ff2d55, 0 0 24px rgba(255,45,85,0.6)',
              }}
            />

            {TIMELINE_EVENTS.map((item, idx) => {
              const isActive = idx === activeStep;

              return (
                <div
                  key={item.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  onClick={() => goToStep(idx)}
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
                        ? 'border-[1.5px] border-[#ff2d55] bg-[#0d0918]/94 shadow-[0_0_38px_rgba(255,45,85,0.48)] scale-[1.01]'
                        : 'border border-white/10 bg-[#070510]/72 hover:border-white/25 hover:bg-[#070510]/90 hover:scale-[1.008]'
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
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-serif text-[0.98rem] sm:text-[1.18rem] font-black tracking-[0.16em] uppercase transition-colors duration-300 leading-tight ${
                            isActive
                              ? 'text-[#ff4d79] drop-shadow-[0_0_18px_rgba(255,77,121,0.9)]'
                              : 'text-white group-hover:text-white/95'
                          }`}
                        >
                          {item.title}
                        </h3>
                        {isActive && (
                          <span className="hidden sm:inline-block rounded-full bg-[#ff2d55]/20 border border-[#ff2d55]/50 px-2 py-0.5 text-[0.55rem] font-mono tracking-wider text-[#ff758c]">
                            {item.tag}
                          </span>
                        )}
                      </div>

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

                    {/* Right: Circular Action Arrow Button (Opens Detail Sheet) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(item);
                        advanceVideo(0.85);
                      }}
                      className={`flex h-7 w-7 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isActive
                          ? 'border-[#ff2d55] bg-[#ff2d55]/25 text-[#ff4d79] shadow-[0_0_16px_rgba(255,45,85,0.7)] scale-105 hover:bg-[#ff2d55] hover:text-white'
                          : 'border-white/20 bg-white/[0.02] text-white/40 group-hover:border-white/50 group-hover:text-white hover:border-[#ff4d79]'
                      }`}
                      aria-label={`View details for ${item.title}`}
                    >
                      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* ── Holographic Event Detail Modal ── */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-slide-up"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[#ff2d55]/50 bg-[#0c0817]/95 p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(255,45,85,0.45)] overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Right Tech Notch Accent */}
            <div className="absolute right-4 top-0 h-[2px] w-16 bg-[#ff4d79] shadow-[0_0_12px_#ff4d79]" />

            {/* Header with Step Tag & Close */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-black text-[#ff4d79] drop-shadow-[0_0_12px_#ff2d55]">
                  {selectedEvent.step}
                </span>
                <span className="h-px w-6 bg-[#ff4d79]" />
                <span className="font-mono text-xs tracking-widest uppercase text-white/60">
                  {selectedEvent.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 hover:border-[#ff4d79] hover:text-white transition-all"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Title */}
            <h3 className="mt-5 font-serif text-2xl sm:text-3xl font-black tracking-wide text-white uppercase drop-shadow-[0_0_20px_rgba(255,77,121,0.6)]">
              {selectedEvent.title}
            </h3>

            {/* Meta badges */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                📅 {selectedEvent.date}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                🕒 {selectedEvent.time}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#ff4d79]/30 bg-[#ff4d79]/10 px-3 py-1.5 text-xs text-[#ff758c]">
                📍 {selectedEvent.location}
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-white/80 font-body">
              {selectedEvent.description}
            </p>

            {/* Key Agenda Highlights */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2.5">
                Session Highlights & Agenda
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90">
                {selectedEvent.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d55] shadow-[0_0_6px_#ff2d55]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
