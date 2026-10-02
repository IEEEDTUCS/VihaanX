import { useState, useEffect } from 'react';

const TARGET = new Date('2026-11-14T00:00:00+05:30');

function calcRemaining() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n) => String(n).padStart(2, '0');

export default function Countdown() {
  const [time, setTime] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { value: time.days,    label: 'Days' },
    { value: time.hours,   label: 'Hours' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ];

  return (
    <div className="mt-8 flex items-start justify-center" aria-label="Countdown to Vihaan X">
      {blocks.map((b, i) => (
        <div className="flex items-start" key={b.label}>
          <div className="flex flex-col items-center gap-1.5">
            <div className="min-w-[2.6rem] rounded-lg border border-white/[.06] bg-white/[.04] px-2 py-2 text-center backdrop-blur-md sm:min-w-[3.4rem] sm:px-3">
              <span className="font-mono text-xl tracking-[.08em] text-[#f0f0f0] sm:text-2xl">{pad(b.value)}</span>
            </div>
            <span className="font-body text-[.55rem] uppercase tracking-[.12em] text-[#505068]">{b.label}</span>
          </div>
          {i < blocks.length - 1 && (
            <span className="animate-pulse-colon px-1.5 pt-2 font-mono text-xl text-violet-400 sm:text-2xl" aria-hidden="true">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
