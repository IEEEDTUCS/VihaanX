'use client';

import { useState, useEffect } from 'react';

// Target hackathon date (e.g. 37 days from now)
const DEFAULT_TARGET = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 43 * 60 * 1000 + 40 * 1000);

export default function Countdown({ targetDate = DEFAULT_TARGET }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 37,
    hours: 23,
    minutes: 43,
    seconds: 40,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Glassmorphic Countdown Box */}
      <div className="relative flex items-center justify-center rounded-2xl border border-white/15 bg-[#091129]/60 px-6 py-4 sm:px-10 sm:py-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        
        {/* Subtle cyan/pink inner glow border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-pink-500/10 pointer-events-none" />

        <div className="flex items-center gap-4 sm:gap-8 relative z-10">
          {units.map((unit, idx) => (
            <div key={unit.label} className="flex items-center gap-4 sm:gap-8">
              <div className="flex flex-col items-center min-w-[50px] sm:min-w-[65px]">
                <span className="font-tech text-2xl sm:text-3xl font-bold tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
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
