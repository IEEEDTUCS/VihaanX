'use client';

import { useState, useEffect } from 'react';

// Target hackathon date: 14th November 2026 (00:00:00 IST)
const DEFAULT_TARGET = new Date('2026-11-14T00:00:00+05:30');

function getRemaining(target) {
  const difference = +new Date(target) - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function Countdown({ targetDate = DEFAULT_TARGET }) {
  const [timeLeft, setTimeLeft] = useState(() => getRemaining(targetDate));

  useEffect(() => {
    const update = () => {
      setTimeLeft(getRemaining(targetDate));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { id: 'vx-days', label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { id: 'vx-hours', label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { id: 'vx-minutes', label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { id: 'vx-seconds', label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Self-contained live ticking script: guarantees seconds decrease every second without reload */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var target = new Date('2026-11-14T00:00:00+05:30').getTime();
              function tick() {
                var diff = target - Date.now();
                if (diff <= 0) diff = 0;
                var d = Math.floor(diff / (1000 * 60 * 60 * 24));
                var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                var m = Math.floor((diff / (1000 * 60)) % 60);
                var s = Math.floor((diff / 1000) % 60);
                var elD = document.getElementById('vx-days');
                var elH = document.getElementById('vx-hours');
                var elM = document.getElementById('vx-minutes');
                var elS = document.getElementById('vx-seconds');
                if (elD) elD.textContent = String(d).padStart(2, '0');
                if (elH) elH.textContent = String(h).padStart(2, '0');
                if (elM) elM.textContent = String(m).padStart(2, '0');
                if (elS) elS.textContent = String(s).padStart(2, '0');
              }
              tick();
              setInterval(tick, 1000);
            })();
          `,
        }}
      />

      {/* Glassmorphic Countdown Box */}
      <div className="relative flex items-center justify-center rounded-2xl border border-white/15 bg-[#091129]/60 px-6 py-4 sm:px-10 sm:py-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        
        {/* Subtle cyan/pink inner glow border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-pink-500/10 pointer-events-none" />

        <div className="flex items-center gap-4 sm:gap-8 relative z-10">
          {units.map((unit, idx) => (
            <div key={unit.label} className="flex items-center gap-4 sm:gap-8">
              <div className="flex flex-col items-center min-w-[50px] sm:min-w-[65px]">
                <span
                  id={unit.id}
                  suppressHydrationWarning
                  className="font-tech text-2xl sm:text-3xl font-bold tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                >
                  {unit.value}
                </span>
                <span className="mt-1 text-[0.55rem] sm:text-[0.62rem] font-medium tracking-[0.28em] text-white/55">
                  {unit.label}
                </span>
              </div>
              {idx < units.length - 1 && (
                <div className="h-8 w-px bg-white/10 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ideas Beyond Limits */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-5 bg-white/20" />
        <span className="text-[0.62rem] sm:text-[0.68rem] font-medium tracking-[0.32em] text-white/40 uppercase">
          IDEAS BEYOND LIMITS
        </span>
        <span className="h-px w-5 bg-white/20" />
      </div>
    </div>
  );
}
