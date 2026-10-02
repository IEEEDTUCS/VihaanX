'use client';

import { useState, useEffect, useRef } from 'react';

/* ── Data ── */
const STATS = [
  { value: 450,  suffix: '+', label: 'Active Members' },
  { value: 40,   suffix: '+', label: 'Years of Legacy' },
  { value: 500,  suffix: '+', label: 'Event Footfall' },
  { value: 3000, suffix: '+', label: 'Registrations' },
];


/* ── Count-up hook ── */
function useCountUp(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  const raf = useRef();

  useEffect(() => {
    if (!active) return;
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      /* ease-out cubic */
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active]);

  return count;
}


/* ── Stat Item ── */
function StatItem({ value, suffix, label, active }) {
  const display = useCountUp(value, 2200, active);
  return (
    <div className="flex flex-1 flex-col items-center gap-1 max-md:basis-1/2 max-md:py-2 md:not-first:border-l md:not-first:border-white/[.06]">
      <span className="text-xl font-bold tracking-[.02em] text-[#f0f0f0]">{active ? display : 0}{suffix}</span>
      <span className="text-[.55rem] uppercase tracking-[.14em] text-[#505068]">{label}</span>
    </div>
  );
}


/* ── Stats Bar ── */
export default function StatsBar() {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[4] border-t border-white/[.06] bg-black/60 backdrop-blur-lg max-md:relative" ref={ref}>
      <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-4 max-md:flex-wrap max-md:gap-y-3 sm:px-8">
        {STATS.map((s, i) => (
          <StatItem key={i} {...s} active={active} />
        ))}
      </div>
    </div>
  );
}
