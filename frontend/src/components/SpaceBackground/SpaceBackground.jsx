'use client';

import VihaanPlanet from './VihaanPlanet';

export default function SpaceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden z-0">
      {/* Background layers */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 1 — Base background */}
        <img
          src="/landingPage/base%20bg.webp"
          alt="" aria-hidden="true"
          className="parallax-bg absolute inset-0 h-full w-full object-cover object-center"
          style={{ transformOrigin: 'center center' }}
        />

        {/* 2 — Stars video */}
        <video
          autoPlay muted loop playsInline
          className="parallax-stars absolute inset-0 h-full w-full object-cover"
          style={{ mixBlendMode: 'screen', opacity: 0.6, transformOrigin: 'center center' }}
        >
          <source src="/landingPage/stars.mp4" type="video/mp4" />
        </video>

        {/* 3 — Vignette */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 70% 60% at 45% 45%, transparent 20%, rgba(4,4,12,0.45) 100%),
            linear-gradient(to bottom, rgba(4,4,12,0.3) 0%, transparent 25%, transparent 65%, rgba(4,4,12,0.9) 100%)
          `,
        }} />
      </div>

      {/* 4 — Planet */}
      <div
        className="parallax-planet absolute hidden lg:block"
        style={{
          right: '-22vw', top: '-15vh',
          width: '52vw', height: '90vh',
          zIndex: 5, pointerEvents: 'none',
          transform: 'rotate(-12deg)',
          transformOrigin: 'center center',
        }}
      >
        <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
          <VihaanPlanet planetSpeed={0.10} ringSpeed={0.8} interactive={true} tilt={0.38} />
        </div>
      </div>
    </div>
  );
}
