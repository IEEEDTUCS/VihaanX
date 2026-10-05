'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../ui/Button';

const TRACKS_DATA = [
  {
    id: 'tech-grand-prix',
    number: '01',
    title: 'TECH',
    titleSecond: 'GRAND PRIX',
    italicTitle: 'TECH GRAND PRIX',
    subtitle: 'OPEN INNOVATION',
    category: 'FLAGSHIP TRACK',
    description: 'Build innovative solutions for real-world challenges across domains.',
    fullDescription:
      'Blend AI, high-performance systems, decentralized protocols, and hardware to solve real-world industry and societal challenges unrestricted by domain boundaries.',
    accentColor: '#ff6b35',
    glowColor: 'rgba(255, 107, 53, 0.85)',
    ambientGlow: 'rgba(255, 80, 40, 0.4)',
    ringColor: '#ff9e58',
    atmosphereBorder: 'rgba(255, 130, 70, 0.9)',
    hueRotate: '0deg', // Original solar gold/amber
    surfaceGradient:
      'radial-gradient(circle at 35% 30%, #ffaa80 0%, #e64a19 28%, #8f1212 58%, #320408 86%, #120103 100%)',
    textureFilter: 'tech-grand-prix-noise',
    stats: { teams: '200+ Expected', prizePool: 'Grand Tier 1', complexity: 'Open / Cross-Domain' },
    keywords: ['Full Stack', 'Cloud Scale', 'Distributed Architecture', 'Systems Design', 'Zero-to-One'],
  },
  {
    id: 'web3-blockchain',
    number: '03',
    title: 'WEB3 &',
    titleSecond: 'BLOCKCHAIN',
    italicTitle: 'WEB3 & BLOCKCHAIN',
    subtitle: 'DECENTRALIZED FUTURE',
    category: 'TRUSTLESS COMPUTING',
    description: 'Architect decentralized dApps, zero-knowledge rollups, DeFi protocols, and sovereign networks.',
    fullDescription:
      'Re-imagine sovereign digital ownership, verifiable compute, and trustless governance. Build high-throughput DeFi protocols, Zero-Knowledge proof systems, and on-chain mechanisms.',
    accentColor: '#ff2d55',
    glowColor: 'rgba(255, 45, 85, 0.85)',
    ambientGlow: 'rgba(255, 30, 70, 0.4)',
    ringColor: '#ff5c7a',
    atmosphereBorder: 'rgba(255, 80, 110, 0.9)',
    hueRotate: '330deg', // Ruby Crimson
    surfaceGradient:
      'radial-gradient(circle at 35% 30%, #ff859d 0%, #e11d48 28%, #780d24 58%, #2d020c 86%, #140004 100%)',
    textureFilter: 'web3-noise',
    stats: { teams: '140+ Expected', prizePool: 'Track Tier 1', complexity: 'Cryptography & Contracts' },
    keywords: ['Smart Contracts', 'ZK-Proofs', 'DeFi Protocols', 'Solana / EVM', 'Decentralized ID'],
  },
  {
    id: 'hardware-iot',
    number: '04',
    title: 'HARDWARE',
    titleSecond: '',
    italicTitle: 'HARDWARE & IOT',
    subtitle: 'EMBEDDED & ROBOTICS',
    category: 'PHYSICAL COMPUTING',
    description: 'Bridge software with physical silicon, microcontrollers, smart sensors, and robotics.',
    fullDescription:
      'Unite cutting-edge software with custom hardware engineering. Prototype IoT telemetry networks, autonomous robotics, FPGA acceleration, and edge-connected wearable systems.',
    accentColor: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.85)',
    ambientGlow: 'rgba(120, 255, 214, 0.35)',
    ringColor: '#a8ff78',
    atmosphereBorder: 'rgba(140, 255, 190, 0.9)',
    hueRotate: '90deg', // Emerald / Jade
    surfaceGradient:
      'radial-gradient(circle at 35% 30%, #bbf7d0 0%, #22c55e 28%, #15623b 58%, #062b1a 86%, #02140c 100%)',
    textureFilter: 'hardware-noise',
    stats: { teams: '120+ Expected', prizePool: 'Track Tier 1', complexity: 'Circuits & Embedded' },
    keywords: ['Microcontrollers', 'Robotics', 'Sensors & Actuators', 'ESP32 / Pi', 'Edge IoT'],
  },
  {
    id: 'social-impact',
    number: '05',
    title: 'SOCIAL',
    titleSecond: 'IMPACT',
    italicTitle: 'SOCIAL IMPACT',
    subtitle: 'TECH FOR GOOD',
    category: 'SUSTAINABILITY & HEALTH',
    description: 'Deploy engineering marvels to uplift society, healthcare access, and environmental sustainability.',
    fullDescription:
      'Apply technical innovation directly to high-impact challenges: climate telemetry, disaster response coordination, accessible assistive technology, and healthcare access equity.',
    accentColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.85)',
    ambientGlow: 'rgba(168, 85, 247, 0.4)',
    ringColor: '#e879f9',
    atmosphereBorder: 'rgba(216, 140, 255, 0.9)',
    hueRotate: '260deg', // Nebula Violet
    surfaceGradient:
      'radial-gradient(circle at 35% 30%, #edd8ff 0%, #a855f7 28%, #641b99 58%, #28073f 86%, #12011c 100%)',
    textureFilter: 'social-noise',
    stats: { teams: '160+ Expected', prizePool: 'Track Tier 1', complexity: 'Impact & Scalability' },
    keywords: ['HealthTech', 'GreenTech', 'Assistive Tech', 'EdTech Access', 'Disaster Relief'],
  },
  {
    id: 'ai-ml',
    number: '02',
    title: 'AI & ML',
    titleSecond: '',
    italicTitle: 'AI & ML',
    subtitle: 'INTELLIGENT SYSTEMS',
    category: 'DATA & INTELLIGENCE',
    description: 'Harness machine learning, deep neural nets, LLMs, and autonomous agents to pioneer the future.',
    fullDescription:
      'Push the frontiers of Artificial Intelligence and Machine Learning. Develop multi-modal agent workflows, specialized fine-tuned LLMs, real-time computer vision pipelines, or edge AI models.',
    accentColor: '#00d2ff',
    glowColor: 'rgba(0, 210, 255, 0.85)',
    ambientGlow: 'rgba(0, 160, 255, 0.4)',
    ringColor: '#00e5ff',
    atmosphereBorder: 'rgba(0, 220, 255, 0.9)',
    hueRotate: '185deg', // Electric Cyan
    surfaceGradient:
      'radial-gradient(circle at 35% 30%, #7ee6ff 0%, #0091ea 28%, #054c80 58%, #021a30 86%, #010a14 100%)',
    textureFilter: 'ai-ml-noise',
    stats: { teams: '180+ Expected', prizePool: 'Track Tier 1', complexity: 'Advanced Intelligence' },
    keywords: ['LLMs & Agents', 'Computer Vision', 'Deep Learning', 'PyTorch / TensorFlow', 'Edge AI'],
  },
];

const wrapAngle = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180;
const STEP_DEG = 360 / TRACKS_DATA.length; // 72 deg

export default function Tracks() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(0);

  // Physics animation state
  const physicsRef = useRef({
    angle: 0,
    velocity: 0,
    targetAngle: 0,
    isManualTarget: false,
    dragStart: null,
    dragMoved: false,
    lastTime: performance.now(),
    pointerX: 0,
    pointerY: 0,
    yaw: 0,
    pitch: 0,
    driftSpeed: 3.0, // degrees per sec idle revolution
  });

  const activeIdxRef = useRef(0);
  activeIdxRef.current = activeIdx;
  const isFlippedRef = useRef(false);
  isFlippedRef.current = isFlipped;

  // Jump/rotate to a track index
  const goToIndex = useCallback((idx, autoFlip = false) => {
    const p = physicsRef.current;
    let target = -idx * STEP_DEG;
    target += 360 * Math.round((p.angle - target) / 360);
    p.targetAngle = target;
    p.isManualTarget = true;
    p.velocity = 0;
    if (activeIdxRef.current !== idx) {
      setIsFlipped(false);
    } else if (autoFlip) {
      setIsFlipped((prev) => !prev);
    }
  }, []);

  const handleNext = useCallback(() => {
    const next = (activeIdxRef.current + 1) % TRACKS_DATA.length;
    goToIndex(next);
  }, [goToIndex]);

  const handlePrev = useCallback(() => {
    const prev = (activeIdxRef.current - 1 + TRACKS_DATA.length) % TRACKS_DATA.length;
    goToIndex(prev);
  }, [goToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape' && isFlippedRef.current) setIsFlipped(false);
      if (e.key === 'Enter' || e.key === ' ') {
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Main 60fps Physics & Orbit Animation Loop with Responsive Scaling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isRunning = true;

    const tick = (now) => {
      if (!isRunning) return;
      const p = physicsRef.current;
      const dt = Math.min((now - p.lastTime) / 1000, 0.05);
      p.lastTime = now;

      // 1. Angular motion calculations
      if (p.dragStart) {
        // Handled in pointermove
      } else if (p.isManualTarget) {
        // Smooth spring damp to target angle
        const diff = p.targetAngle - p.angle;
        const springAccel = 110 * diff - 18 * p.velocity;
        p.velocity += springAccel * dt;
        p.angle += p.velocity * dt;
        if (Math.abs(diff) < 0.05 && Math.abs(p.velocity) < 0.1) {
          p.angle = p.targetAngle;
          p.velocity = 0;
          p.isManualTarget = false;
        }
      } else {
        // Idle state: subtle cosmic revolving drift if not hovered and not flipped
        const paused = isHovered || isFlippedRef.current;
        const targetCruise = paused ? 0 : p.driftSpeed;
        p.velocity += (targetCruise - p.velocity) * (1 - Math.exp(-dt / 0.4));
        p.angle += p.velocity * dt;

        // When almost stopping or settling, snap smoothly
        if (paused && Math.abs(p.velocity) < 0.5) {
          const nearest = Math.round(p.angle / STEP_DEG) * STEP_DEG;
          p.targetAngle = nearest;
          p.isManualTarget = true;
        }
      }

      // 2. Parallax perspective damping
      const aimYaw = p.pointerX * 5.0;
      const aimPitch = -p.pointerY * 3.0;
      p.yaw += (aimYaw - p.yaw) * (1 - Math.exp(-dt / 0.25));
      p.pitch += (aimPitch - p.pitch) * (1 - Math.exp(-dt / 0.25));

      // 3. Update active index
      const curIndex = ((Math.round(-p.angle / STEP_DEG) % TRACKS_DATA.length) + TRACKS_DATA.length) % TRACKS_DATA.length;
      if (curIndex !== activeIdxRef.current) {
        setActiveIdx(curIndex);
      }

      // 4. Transform planet DOM nodes dynamically with responsive calculations
      const planetElements = container.querySelectorAll('.planet-orbit-card');
      const containerWidth = container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
      const isMobile = containerWidth < 640;
      const isTablet = containerWidth >= 640 && containerWidth < 1024;
      
      const arcWidth = isMobile
        ? Math.min(containerWidth * 0.38, 170)
        : isTablet
        ? Math.min(containerWidth * 0.42, 380)
        : Math.min(containerWidth * 0.44, 540);

      planetElements.forEach((el, index) => {
        const baseAngle = index * STEP_DEG;
        const relAngle = wrapAngle(baseAngle + p.angle); // -180 to +180 deg
        const rad = (relAngle * Math.PI) / 180;

        // Cylindrical horizontal projection
        const sinVal = Math.sin(rad);
        const cosVal = Math.cos(rad);

        const x = sinVal * arcWidth;
        const y = (1 - cosVal) * (isMobile ? 12 : 22);
        const z = cosVal * (isMobile ? 80 : 120);
        
        const scale = isMobile
          ? 0.42 + 0.58 * Math.pow((1 + cosVal) / 2, 1.4)
          : 0.54 + 0.62 * Math.pow((1 + cosVal) / 2, 1.3);
          
        const opacity = isMobile
          ? 0.35 + 0.65 * Math.pow((1 + cosVal) / 2, 2.0)
          : 0.72 + 0.28 * Math.pow((1 + cosVal) / 2, 1.2);
          
        const zIndex = Math.round(20 + 40 * ((1 + cosVal) / 2));

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = zIndex;
      });

      // Update stage tilt
      const stage = container.querySelector('.orbit-stage');
      if (stage) {
        stage.style.transform = `rotateX(${p.pitch.toFixed(2)}deg) rotateY(${p.yaw.toFixed(2)}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered]);

  // Pointer Drag & Parallax Handlers (Mobile Touch & Mouse)
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const p = physicsRef.current;
    p.dragStart = {
      x: e.clientX,
      y: e.clientY,
      angle: p.angle,
      time: performance.now(),
      samples: [{ time: performance.now(), angle: p.angle }],
    };
    p.dragMoved = false;
    p.isManualTarget = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const p = physicsRef.current;

    // Parallax coordinates in [-1, 1]
    p.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    p.pointerY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    if (!p.dragStart) return;

    const deltaX = e.clientX - p.dragStart.x;
    if (!p.dragMoved && Math.abs(deltaX) > 6) {
      p.dragMoved = true;
      if (isFlippedRef.current) setIsFlipped(false);
    }

    if (p.dragMoved) {
      const perPixel = 180 / (Math.PI * 320);
      p.angle = p.dragStart.angle + deltaX * perPixel;
      const now = performance.now();
      p.dragStart.samples.push({ time: now, angle: p.angle });
      while (p.dragStart.samples.length > 3 && now - p.dragStart.samples[0].time > 120) {
        p.dragStart.samples.shift();
      }
    }
  };

  const handlePointerUp = () => {
    const p = physicsRef.current;
    if (!p.dragStart) return;

    if (p.dragMoved) {
      const first = p.dragStart.samples[0];
      const last = p.dragStart.samples[p.dragStart.samples.length - 1];
      const dt = (last.time - first.time) / 1000;
      const velocity = dt > 0.01 ? (last.angle - first.angle) / dt : 0;
      p.velocity = Math.max(-600, Math.min(600, velocity));

      // Snap with momentum
      const nearest = Math.round((p.angle + p.velocity * 0.28) / STEP_DEG) * STEP_DEG;
      p.targetAngle = nearest;
      p.isManualTarget = true;
    }

    p.dragStart = null;
    setIsDragging(false);
  };

  const currentTrack = TRACKS_DATA[activeIdx] || TRACKS_DATA[0];

  return (
    <section
      id="tracks"
      className="relative z-20 min-h-screen w-full overflow-hidden bg-[#040209] py-8 text-white sm:py-14 lg:py-20 select-none"
      aria-label="Hackathon Tracks"
    >
      {/* ── SVG Filters for Procedural Surface Textures ── */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="tech-grand-prix-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.8   0 0.3 0 0 0.2   0 0 0.1 0 0.05   0 0 0 0.45 0"
              in="noise"
              result="coloredNoise"
            />
            <feBlend mode="color-dodge" in="SourceGraphic" in2="coloredNoise" />
          </filter>
          <filter id="ai-ml-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="3" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0 0.4 0 0 0.1   0 0.8 0 0 0.6   1 0 1 0 0.9   0 0 0 0.4 0"
              in="noise"
              result="coloredNoise"
            />
            <feBlend mode="screen" in="SourceGraphic" in2="coloredNoise" />
          </filter>
          <filter id="web3-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" result="noise" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.7   0 0.1 0 0 0.1   0 0 0.3 0 0.3   0 0 0 0.4 0"
              in="noise"
              result="coloredNoise"
            />
            <feBlend mode="color-dodge" in="SourceGraphic" in2="coloredNoise" />
          </filter>
          <filter id="hardware-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.038" numOctaves="3" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0.2 0 0 0 0.1   0 1 0 0 0.7   0 0.5 0 0 0.4   0 0 0 0.35 0"
              in="noise"
              result="coloredNoise"
            />
            <feBlend mode="screen" in="SourceGraphic" in2="coloredNoise" />
          </filter>
          <filter id="social-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="4" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0.8 0 0 0 0.6   0 0.2 0 0 0.2   1 0 1 0 0.9   0 0 0 0.4 0"
              in="noise"
              result="coloredNoise"
            />
            <feBlend mode="screen" in="SourceGraphic" in2="coloredNoise" />
          </filter>
        </defs>
      </svg>

      {/* ── 1. Cosmic Background Layers ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/tracks/tracks_base_bg.png"
          alt="Cosmic tracks background"
          className="h-full w-full object-cover object-center"
        />

        <video
          ref={videoRef}
          src="/tracks/meteroids.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          style={{ mixBlendMode: 'screen', opacity: 0.55 }}
        />

        {/* Ambient Darkening & Horizon Vignettes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 95% 80% at 50% 50%, transparent 40%, rgba(4,2,9,0.55) 75%, rgba(4,2,9,0.92) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-24 sm:h-28"
          style={{
            background: 'linear-gradient(to bottom, #0a0a0f 0%, rgba(10,10,15,0.7) 60%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 sm:h-28"
          style={{
            background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.7) 60%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Main Section Container ── */}
      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] flex-col justify-between px-3.5 sm:px-6 lg:px-8">
        
        {/* ── Top-Left Header: Exact Match to Mockup Design ── */}
        <div className="relative flex flex-col items-start pt-1 sm:pt-4">
          {/* Vertical Pink Indicator Guide Line */}
          <div className="absolute -left-3 top-2 hidden flex-col items-center sm:-left-5 sm:flex">
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-[#ff4d79] to-[#ff4d79]" />
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4d79] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#ff4d79]" />
            </span>
            <div className="h-16 w-px bg-gradient-to-b from-[#ff4d79] via-[#ff4d79]/30 to-transparent" />
          </div>

          {/* Section Index Badge: 04 ── */}
          <div className="mb-0.5 sm:mb-1 flex items-center gap-2.5 sm:gap-3">
            <span className="font-display text-[0.7rem] font-bold tracking-[0.25em] text-[#ff4d79] sm:text-xs">
              04
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-[#ff4d79] to-transparent sm:w-14" />
          </div>

          {/* EXPLORE THE */}
          <p className="font-body text-[0.62rem] font-semibold tracking-[0.28em] uppercase text-white/70 sm:text-[0.8rem]">
            EXPLORE THE
          </p>

          {/* TRACKS Main Heading with glowing magenta 'S' */}
          <h2 className="my-0.5 font-display text-[1.95rem] font-black tracking-[0.14em] text-white sm:text-[3rem] lg:text-[3.8rem] leading-none">
            TRACK
            <span className="bg-gradient-to-r from-[#ff758c] via-[#ff4d6d] to-[#ff2a6d] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,77,109,0.9)]">
              S
            </span>
          </h2>

          {/* Tagline Subtext */}
          <div className="mt-0.5 sm:mt-1 flex flex-col gap-0.5">
            <p className="font-body text-[0.54rem] font-semibold tracking-[0.22em] text-white/50 sm:text-[0.68rem]">
              DIVE INTO IDEAS
            </p>
            <p className="font-body text-[0.54rem] font-semibold tracking-[0.22em] text-white/50 sm:text-[0.68rem]">
              BUILD WHAT MATTERS
            </p>
          </div>
        </div>

        {/* ── Center: Interactive 3D Orbiting Planet System ── */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            const p = physicsRef.current;
            p.pointerX = 0;
            p.pointerY = 0;
          }}
          className={`relative my-2 sm:my-6 flex h-[380px] sm:h-[480px] lg:h-[550px] w-full items-center justify-center cursor-grab ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          style={{ perspective: '1600px', touchAction: 'pan-y' }}
        >
          {/* Horizontal Celestial Orbital Ray connecting all planets */}
          <div
            className="pointer-events-none absolute inset-x-[-15%] top-1/2 -translate-y-1/2 h-[2px] z-10 hidden sm:block"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(192,132,252,0.3) 15%, rgba(0,210,255,0.6) 35%, rgba(255,107,53,0.85) 50%, rgba(255,45,85,0.6) 65%, rgba(74,222,128,0.3) 85%, transparent 100%)',
              boxShadow: '0 0 20px rgba(255,107,53,0.6)',
            }}
          />

          {/* 3D Orbit Stage */}
          <div
            className="orbit-stage relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {TRACKS_DATA.map((track, idx) => {
              const isActive = idx === activeIdx;

              return (
                <div
                  key={track.id}
                  className="planet-orbit-card absolute flex items-center justify-center transition-[transform,opacity] duration-300 ease-out select-none"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (physicsRef.current.dragMoved) return;
                    if (isActive) {
                      // Click again to flip card
                      setIsFlipped((prev) => !prev);
                    } else {
                      goToIndex(idx);
                    }
                  }}
                >
                  {/* Planet Outer Container Size */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: 'clamp(240px, 72vw, 420px)',
                      height: 'clamp(240px, 72vw, 420px)',
                    }}
                  >
                    {/* Atmospheric Outer Corona Glow (Visible on front face) */}
                    <div
                      className="pointer-events-none absolute inset-[-14%] rounded-full transition-all duration-700"
                      style={{
                        background: `radial-gradient(circle, ${track.glowColor} 0%, ${track.ambientGlow} 48%, rgba(0,0,0,0) 74%)`,
                        filter: isActive ? 'blur(20px)' : 'blur(10px)',
                        opacity: isActive && !isFlipped ? 0.95 : 0.55,
                      }}
                    />

                    {/* Planetary Orbit Ring with Nodes (3D Tilted Ring) */}
                    <div
                      className="pointer-events-none absolute inset-[-18%] rounded-full border transition-all duration-700"
                      style={{
                        borderColor: track.atmosphereBorder,
                        borderWidth: isActive ? '1.5px' : '1px',
                        opacity: isActive && !isFlipped ? 0.9 : 0.45,
                        transform: isActive
                          ? 'rotateX(74deg) rotateY(16deg) rotateZ(8deg)'
                          : 'rotateX(74deg) rotateY(0deg) rotateZ(0deg)',
                        boxShadow: `0 0 22px ${track.glowColor}`,
                        animation: isActive ? 'spin 22s linear infinite' : 'spin 38s linear infinite',
                      }}
                    >
                      <span
                        className="absolute -top-1.5 left-1/4 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]"
                        style={{ background: track.ringColor }}
                      />
                      <span
                        className="absolute -bottom-1.5 right-1/4 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                        style={{ background: track.ringColor }}
                      />
                    </div>

                    {/* ── 3D FLIP CARD CONTAINER ── */}
                    <div
                      className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isActive && isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* ══════════════════════════════════════════════════════════════ */}
                      {/* FRONT FACE: Realistic Planet Sphere                          */}
                      {/* ══════════════════════════════════════════════════════════════ */}
                      <div
                        className="absolute inset-[4%] flex flex-col items-center justify-center overflow-hidden rounded-full p-3.5 sm:p-6 text-center shadow-[0_0_45px_rgba(0,0,0,0.9)]"
                        style={{
                          backfaceVisibility: 'hidden',
                          background: track.surfaceGradient,
                          boxShadow: `
                            inset -20px -24px 55px rgba(0,0,0,0.96),
                            inset -8px -10px 20px rgba(0,0,0,0.85),
                            inset 12px 14px 30px rgba(255,255,255,0.4),
                            0 0 45px ${track.glowColor}
                          `,
                          border: `1.5px solid ${track.atmosphereBorder}`,
                        }}
                      >
                        {/* Surface Texture */}
                        <div
                          className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay opacity-85"
                          style={{
                            background: track.surfaceGradient,
                            filter: `url(#${track.textureFilter})`,
                          }}
                        />

                        {/* Volumetric Spherical Shading & Rim Lighting */}
                        <div
                          className="pointer-events-none absolute inset-0 rounded-full"
                          style={{
                            background: `
                              radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.06) 40%, transparent 65%),
                              radial-gradient(circle at 75% 82%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 45%, transparent 75%)
                            `,
                          }}
                        />

                        {/* Content on Planet Sphere */}
                        <div className="relative z-20 flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3">
                          
                          {/* Number Badge with Underline */}
                          <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                            <span
                              className="font-serif text-[0.8rem] sm:text-[1.05rem] font-bold tracking-[0.24em] text-white"
                              style={{ textShadow: `0 0 14px ${track.glowColor}, 0 2px 6px rgba(0,0,0,0.9)` }}
                            >
                              {track.number}
                            </span>
                            <span
                              className="h-[1.5px] w-5 sm:w-7 rounded-full shadow-[0_0_8px_currentColor]"
                              style={{ background: track.ringColor, color: track.ringColor }}
                            />
                          </div>

                          {/* Title */}
                          <div className="mt-0.5 sm:mt-1 flex flex-col items-center">
                            <h3
                              className={`font-serif font-extrabold uppercase text-white leading-tight tracking-[0.14em] ${
                                isActive
                                  ? 'text-[1.05rem] sm:text-[1.38rem] lg:text-[1.65rem]'
                                  : 'text-[0.7rem] sm:text-[0.9rem]'
                              }`}
                              style={{
                                textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8)',
                              }}
                            >
                              {track.title}
                            </h3>
                            {track.titleSecond && (
                              <h3
                                className={`font-serif font-extrabold uppercase text-white leading-tight tracking-[0.14em] ${
                                  isActive
                                    ? 'text-[1.05rem] sm:text-[1.38rem] lg:text-[1.65rem]'
                                    : 'text-[0.7rem] sm:text-[0.9rem]'
                                }`}
                                style={{
                                  textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8)',
                                }}
                              >
                                {track.titleSecond}
                              </h3>
                            )}
                          </div>

                          {/* Description (on Active Planet) */}
                          {isActive && (
                            <p className="mt-1.5 line-clamp-2 max-w-[210px] sm:max-w-[270px] font-body text-[0.58rem] sm:text-[0.7rem] font-medium leading-relaxed tracking-[0.03em] text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                              {track.description}
                            </p>
                          )}

                          {/* Center CTA Button (StarBorder) or Side Round Arrow */}
                          {isActive ? (
                            <div className="mt-2.5 sm:mt-3.5">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsFlipped(true);
                                }}
                                size="sm"
                                color={track.accentColor}
                                borderColor={track.atmosphereBorder}
                                innerClassName="bg-black/75 backdrop-blur-md font-serif font-bold tracking-[0.16em] text-[0.58rem] sm:text-[0.68rem] px-4 sm:px-6 py-1 sm:py-1.5 text-white"
                              >
                                EXPLORE &nbsp;&rarr;
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="mt-2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/35 bg-black/60 text-[0.65rem] sm:text-sm text-white/90 shadow-[0_0_12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:border-white group-hover:bg-white/20 group-hover:text-white"
                              style={{ borderColor: track.atmosphereBorder }}
                            >
                              &rarr;
                            </div>
                          )}

                        </div>
                      </div>

                      {/* ══════════════════════════════════════════════════════════════ */}
                      {/* BACK FACE: Info Card based on /tracks/card.png (Image 2)     */}
                      {/* ══════════════════════════════════════════════════════════════ */}
                      <div
                        className="absolute inset-0 flex h-full w-full flex-col items-center justify-center text-center select-none"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        {/* High-res Celestial Artwork from /tracks/card.png Edge-to-Edge */}
                        <img
                          src="/tracks/card.png"
                          alt=""
                          className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
                          style={{
                            filter: `hue-rotate(${track.hueRotate}) brightness(0.82) contrast(1.02)`,
                            opacity: 0.85,
                          }}
                        />

                        {/* Dark Volumetric Center Scrim (Makes text 100% visible and razor-sharp) */}
                        <div
                          className="pointer-events-none absolute inset-[12%] rounded-full"
                          style={{
                            background:
                              'radial-gradient(circle at 50% 50%, rgba(4,2,9,0.92) 0%, rgba(4,2,9,0.82) 48%, rgba(4,2,9,0.35) 75%, transparent 100%)',
                          }}
                        />

                        {/* Top-Right Circular Close Button (Matching Image 2) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                          }}
                          aria-label="Close track info"
                          className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/40 bg-black/80 text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all hover:scale-110 hover:border-white hover:bg-white/25 hover:text-white active:scale-95"
                        >
                          &times;
                        </button>

                        {/* Card Content Overlay */}
                        <div className="relative z-20 flex max-w-[240px] sm:max-w-[290px] flex-col items-center justify-center px-3 sm:px-4">
                          
                          {/* Track Category / Tag */}
                          <span
                            className="font-serif text-[0.55rem] sm:text-[0.68rem] font-bold tracking-[0.24em] uppercase"
                            style={{
                              color: track.ringColor,
                              textShadow: '0 2px 8px rgba(0,0,0,1)',
                            }}
                          >
                            {track.category}
                          </span>

                          {/* Italic Glowing Title (Matching Image 2: High Visibility) */}
                          <h3
                            className="mt-0.5 sm:mt-1 font-serif italic font-black uppercase text-white tracking-[0.06em] text-[1.15rem] sm:text-[1.55rem] lg:text-[1.75rem] leading-none"
                            style={{
                              color: '#ffffff',
                              textShadow: `0 0 20px ${track.glowColor}, 0 2px 10px rgba(0,0,0,1), 0 0 2px ${track.accentColor}`,
                            }}
                          >
                            {track.italicTitle}
                          </h3>

                          {/* Star / Diamond Divider Line (── ✦ ──) */}
                          <div className="my-1.5 sm:my-2.5 flex items-center justify-center gap-1.5 sm:gap-2">
                            <span
                              className="h-px w-8 sm:w-12"
                              style={{
                                background: `linear-gradient(to right, transparent, ${track.accentColor})`,
                              }}
                            />
                            <span
                              className="text-[0.65rem] sm:text-xs"
                              style={{
                                color: track.ringColor,
                                textShadow: `0 0 10px ${track.accentColor}`,
                              }}
                            >
                              ✦
                            </span>
                            <span
                              className="h-px w-8 sm:w-12"
                              style={{
                                background: `linear-gradient(to left, transparent, ${track.accentColor})`,
                              }}
                            />
                          </div>

                          {/* Description: Highly Readable Clean Font */}
                          <p
                            className="font-body text-[0.6rem] sm:text-[0.74rem] font-normal leading-relaxed tracking-[0.02em] text-[#f0f0f0]"
                            style={{
                              textShadow: '0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,0.9)',
                            }}
                          >
                            {track.description}
                          </p>

                          {/* Sub-Themes / Stats Pill Bar */}
                          <div className="mt-2 sm:mt-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-3 py-0.5 sm:py-1 text-[0.52rem] sm:text-[0.62rem] font-medium tracking-[0.12em] text-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.8)] backdrop-blur-md">
                            <span>{track.stats.teams}</span>
                            <span className="text-white/30">•</span>
                            <span>{track.stats.prizePool}</span>
                          </div>

                          {/* Action Button: Register CTA */}
                          <div className="mt-2.5 sm:mt-3.5">
                            <Button
                              href="/register"
                              size="sm"
                              color={track.accentColor}
                              borderColor={track.atmosphereBorder}
                              innerClassName="bg-black/85 backdrop-blur-md font-serif font-bold tracking-[0.14em] text-[0.58rem] sm:text-[0.68rem] px-4 sm:px-6 py-1 sm:py-1.5 text-white shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                            >
                              REGISTER NOW &nbsp;&rarr;
                            </Button>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Controls: Navigation Arrows & Segmented Progress Bar ── */}
        <div className="relative z-30 flex flex-col items-center justify-center gap-2.5 sm:gap-3 pb-1.5 sm:pb-4">
          <div className="flex items-center gap-4 sm:gap-7">
            
            {/* Left Circular Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous track"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xs sm:text-sm text-white/85 backdrop-blur-md transition-all hover:scale-110 hover:border-[#ff4d79] hover:bg-[#ff4d79]/20 hover:text-white hover:shadow-[0_0_18px_rgba(255,77,121,0.5)] active:scale-95"
            >
              &larr;
            </button>

            {/* Pagination Segmented Glow Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 sm:px-3.5 sm:py-1.5 backdrop-blur-md">
              {TRACKS_DATA.map((t, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => goToIndex(idx)}
                    aria-label={`Go to ${t.title} ${t.titleSecond}`}
                    className="group relative flex items-center py-1"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-500 ${
                        isActive
                          ? 'w-8 sm:w-14 shadow-[0_0_14px_currentColor]'
                          : 'w-1.5 sm:w-2 bg-white/25 group-hover:bg-white/50'
                      }`}
                      style={{
                        background: isActive
                          ? `linear-gradient(90deg, ${t.ringColor}, ${t.accentColor})`
                          : undefined,
                        color: t.accentColor,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Circular Arrow Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next track"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xs sm:text-sm text-white/85 backdrop-blur-md transition-all hover:scale-110 hover:border-[#ff4d79] hover:bg-[#ff4d79]/20 hover:text-white hover:shadow-[0_0_18px_rgba(255,77,121,0.5)] active:scale-95"
            >
              &rarr;
            </button>
          </div>

          {/* Current Active Track Title Indicator */}
          <div className="flex items-center gap-2 text-[0.58rem] sm:text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-white/50">
            <span className="font-serif text-[#ff4d79] font-bold">{currentTrack.number}</span>
            <span>/</span>
            <span>05</span>
            <span className="mx-1 text-white/20">•</span>
            <span className="text-white/90">
              {currentTrack.title} {currentTrack.titleSecond}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
