'use client';

export default function ObjectAnimations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden select-none">
      
      {/* ── 1. Giant Pink Ringed Planet Atmospheric Aura ── */}
      <div
        className="absolute animate-aura rounded-full"
        style={{
          top: '3%',
          right: '9%',
          width: 'clamp(240px, 34vw, 550px)',
          height: 'clamp(240px, 34vw, 550px)',
          background: 'radial-gradient(circle, rgba(255, 60, 140, 0.22) 0%, rgba(244, 63, 94, 0.08) 55%, transparent 75%)',
          filter: 'blur(32px)',
        }}
      />

      {/* ── 2. Glowing Blue Moon Aura (Left Sky) ── */}
      <div
        className="absolute rounded-full"
        style={{
          top: '32%',
          left: '14.5%',
          width: 'clamp(35px, 5vw, 75px)',
          height: 'clamp(35px, 5vw, 75px)',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.15) 60%, transparent 80%)',
          filter: 'blur(10px)',
          animation: 'auraBreath 4s ease-in-out infinite',
        }}
      />

      {/* ── 3. Radar Dish Transmission Signal Rings (Left Colony Base) ── */}
      <div
        className="absolute"
        style={{
          bottom: '36%',
          left: '19.8%',
        }}
      >
        {/* Ring 1 */}
        <div
          className="absolute -top-3 -left-3 h-8 w-8 rounded-full border border-cyan-400/80 animate-radar"
          style={{ animationDelay: '0s' }}
        />
        {/* Ring 2 */}
        <div
          className="absolute -top-3 -left-3 h-8 w-8 rounded-full border border-sky-300/60 animate-radar"
          style={{ animationDelay: '1.1s' }}
        />
        {/* Ring 3 */}
        <div
          className="absolute -top-3 -left-3 h-8 w-8 rounded-full border border-pink-400/50 animate-radar"
          style={{ animationDelay: '2.2s' }}
        />
      </div>

      {/* ── 4. Right Observatory Tower: Red Antenna Warning Beacon ── */}
      <div
        className="absolute"
        style={{
          top: '38%',
          right: '5.4%',
        }}
      >
        <span className="block h-2 w-2 rounded-full bg-red-500 animate-beacon-red" />
      </div>

      {/* ── 5. Right Observatory Satellite Dish: Cyan Telemetry Beacon ── */}
      <div
        className="absolute"
        style={{
          top: '41.5%',
          right: '10.8%',
        }}
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-beacon-cyan" />
      </div>

      {/* ── 6. Left Ground Base Antenna Beacon ── */}
      <div
        className="absolute"
        style={{
          bottom: '43%',
          left: '9.2%',
        }}
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-amber-400 animate-beacon-cyan" />
      </div>

      {/* ── 7. Astronaut Life Support Status LED Pulse ── */}
      <div
        className="absolute"
        style={{
          bottom: '22.8%',
          left: '26.8%',
        }}
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] animate-pulse" />
      </div>

    </div>
  );
}
