'use client';

import { useEffect, useState, useRef } from 'react';

/* ------------------------------------------------------------------
   Animated star-particle background for the loader
   ------------------------------------------------------------------ */
function LoaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    const stars = Array.from({ length: 180 }, (_, i) => {
      const s = (n, salt) => { const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return v - Math.floor(v); };
      return {
        x: s(i, 1), y: s(i, 2),
        size:  0.3 + s(i, 3) * 1.4,
        speed: 0.3 + s(i, 4) * 1.6,
        phase: s(i, 5) * Math.PI * 2,
        color: s(i, 6) > 0.85 ? '180,160,255' : s(i, 6) > 0.70 ? '160,200,255' : '220,220,255',
      };
    });

    // Shooting stars
    const shoots = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random(), y: Math.random() * 0.5,
      len: 0.06 + Math.random() * 0.08,
      speed: 0.0006 + Math.random() * 0.0008,
      angle: Math.PI * 0.18,
      opacity: 0,
      delay: i * 1800 + Math.random() * 2000,
      active: false,
      t: 0,
    }));

    let animId, t = 0, lastTime = 0;

    const draw = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep space gradient background
      const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
      bg.addColorStop(0,   '#08061a');
      bg.addColorStop(0.4, '#0a0a1f');
      bg.addColorStop(1,   '#050510');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle nebula glow patches
      const nebs = [
        { x: 0.15, y: 0.25, r: 0.22, c: '80,40,160' },
        { x: 0.75, y: 0.6,  r: 0.18, c: '20,60,120' },
        { x: 0.5,  y: 0.85, r: 0.15, c: '100,20,80' },
      ];
      nebs.forEach(n => {
        const grd = ctx.createRadialGradient(n.x*W, n.y*H, 0, n.x*W, n.y*H, n.r*Math.max(W,H));
        grd.addColorStop(0, `rgba(${n.c},0.13)`);
        grd.addColorStop(1, `rgba(${n.c},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      });

      // Twinkling stars
      stars.forEach(star => {
        const tw = 0.4 + 0.6 * Math.sin(t * star.speed + star.phase);
        const op = 0.2 + 0.8 * tw;
        const px = star.x * W, py = star.y * H;
        const grd = ctx.createRadialGradient(px, py, 0, px, py, star.size * 3);
        grd.addColorStop(0, `rgba(${star.color},${op})`);
        grd.addColorStop(1, `rgba(${star.color},0)`);
        ctx.beginPath(); ctx.arc(px, py, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, star.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op * 0.9})`; ctx.fill();
      });

      // Shooting stars
      shoots.forEach(s => {
        s.t += dt * 1000;
        if (s.t < s.delay) return;
        if (!s.active) { s.active = true; s.x = 0.1 + Math.random() * 0.6; s.y = Math.random() * 0.4; }
        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);
        // fade in/out
        const progress = (s.x - 0.1) / 0.8;
        s.opacity = progress < 0.15 ? progress / 0.15 : progress > 0.85 ? (1 - progress) / 0.15 : 1;
        if (s.x > 1.1) { s.x = 0.05 + Math.random() * 0.3; s.y = Math.random() * 0.35; s.active = false; s.delay = 1000 + Math.random() * 3000; s.t = 0; }

        const x1 = s.x * W, y1 = s.y * H;
        const x0 = x1 - Math.cos(s.angle) * s.len * W;
        const y0 = y1 - Math.sin(s.angle) * s.len * W;
        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(200,180,255,${s.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity})`);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ------------------------------------------------------------------
   Main Loader
   ------------------------------------------------------------------ */
export default function Loader({ onComplete }) {
  const [fadeOut,   setFadeOut]   = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [showSub,   setShowSub]   = useState(false);
  const videoRef = useRef(null);

  // Progress animation: 0→100 over ~2.6s
  useEffect(() => {
    const start = performance.now();
    const duration = 2600;
    let rafId;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Show subtitle after 600ms
  useEffect(() => {
    const t = setTimeout(() => setShowSub(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Fade out at 2800ms
  useEffect(() => {
    const t = setTimeout(() => setFadeOut(true), 2800);
    return () => clearTimeout(t);
  }, []);

  // Call onComplete after fade
  useEffect(() => {
    if (!fadeOut) return;
    const t = setTimeout(onComplete, 900);
    return () => clearTimeout(t);
  }, [fadeOut, onComplete]);

  // Autoplay video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const segments = 12;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-[opacity,visibility] duration-[900ms] ${fadeOut ? 'invisible opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      {/* Animated starfield background */}
      <LoaderBackground />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center gap-10">

        {/* Video logo */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: '340px', height: '340px',
              background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)',
              filter: 'blur(18px)',
              animation: 'loaderGlowPulse 2s ease-in-out infinite',
            }}
          />
          <video
            ref={videoRef}
            src="/loader.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="relative w-[min(380px,75vw)] h-auto"
            style={{ filter: 'drop-shadow(0 0 32px rgba(124,58,237,0.5))' }}
          />
        </div>

        {/* Subtitle */}
        <div
          className="flex flex-col items-center gap-2"
          style={{
            opacity: showSub ? 1 : 0,
            transform: showSub ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <span
            className="text-[0.6rem] tracking-[0.45em] uppercase text-gray-300"
            style={{ fontFamily: 'var(--font-body, sans-serif)' }}
          >
            THE 10TH EDITION
          </span>
          <div className="flex gap-1.5 items-center">
            {['NORTH', 'INDIA\'S', 'LARGEST', 'HACKATHON'].map((w, i) => (
              <span
                key={w}
                className="text-[0.45rem] tracking-[0.2em] uppercase"
                style={{
                  color: 'rgba(160,130,255,0.7)',
                  opacity: showSub ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.2 + i * 0.1}s`,
                }}
              >
                {w}{i < 3 ? <span className="mx-1 text-violet-600/50">·</span> : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar section */}
        <div className="flex flex-col items-center gap-3 w-[min(280px,65vw)]">

          {/* Segmented progress bar */}
          <div className="flex gap-[3px] w-full">
            {Array.from({ length: segments }).map((_, i) => {
              const filled = (i / segments) * 100 < progress;
              const partial = !filled && ((i / segments) * 100 < progress + (100 / segments));
              return (
                <div
                  key={i}
                  className="h-[3px] flex-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                      width: filled ? '100%' : partial ? `${((progress - (i / segments) * 100) / (100 / segments)) * 100}%` : '0%',
                      background: filled
                        ? 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)'
                        : 'linear-gradient(90deg, #7c3aed, #a855f7)',
                      boxShadow: filled ? '0 0 6px rgba(168,85,247,0.8)' : 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom row — loading text + percentage */}
          <div className="flex items-center justify-between w-full">
            <span
              className="text-[0.5rem] tracking-[0.3em] uppercase text-violet-400/60"
              style={{ fontFamily: 'var(--font-body, sans-serif)' }}
            >
              {progress < 30 ? 'Initializing' : progress < 65 ? 'Loading Assets' : progress < 90 ? 'Almost Ready' : 'Launching'}
            </span>
            <span
              className="text-[0.65rem] tabular-nums text-violet-300/80"
              style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
            >
              {String(progress).padStart(3, '0')}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
