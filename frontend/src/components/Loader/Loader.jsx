'use client';

import { useEffect, useState, useRef } from 'react';

export default function Loader({ onComplete }) {
  const [fadeOut,  setFadeOut]  = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Animate progress 0→100 over 2.6s (ease-out)
  useEffect(() => {
    const start = performance.now();
    const duration = 2600;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Fade out at 2800ms
  useEffect(() => {
    const t = setTimeout(() => setFadeOut(true), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!fadeOut) return;
    const t = setTimeout(onComplete, 900);
    return () => clearTimeout(t);
  }, [fadeOut, onComplete]);

  // Autoplay
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-[opacity,visibility] duration-[900ms] ${fadeOut ? 'invisible opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      {/* Background — deep dark with subtle radial glow at center to blend with video */}
      <div className="absolute inset-0 bg-[#050508]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 48%, rgba(20,10,40,0.0) 0%, rgba(5,5,8,0.7) 55%, #050508 80%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">

        {/* Video — replaces the old VIHAANX text/logo */}
        <video
          ref={videoRef}
          src="/loader.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-[min(460px,80vw)] h-auto"
          style={{
            // Mask edges so video blends seamlessly into dark bg
            maskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 75%)',
          }}
        />

        {/* Edition tag */}
        <span
          className="text-[0.58rem] tracking-[0.5em] uppercase text-white/40"
          style={{ marginTop: '-1rem' }}
        >
          THE 10TH EDITION
        </span>

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-2 w-[min(300px,65vw)]">
          {/* Track */}
          <div className="relative w-full h-[2px] rounded-full overflow-hidden bg-white/10">
            {/* Fill */}
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-none"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #5b21b6, #7c3aed, #a78bfa)',
                boxShadow: '0 0 8px rgba(167,139,250,0.8), 0 0 20px rgba(124,58,237,0.4)',
              }}
            />
            {/* Trailing glow dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full"
              style={{
                left: `calc(${progress}% - 2.5px)`,
                background: '#c4b5fd',
                boxShadow: '0 0 6px 2px rgba(196,181,253,0.9)',
              }}
            />
          </div>

          {/* Percentage */}
          <span
            className="text-[0.55rem] tracking-[0.2em] text-white/30"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {String(progress).padStart(3, '0')} %
          </span>
        </div>

      </div>
    </div>
  );
}
