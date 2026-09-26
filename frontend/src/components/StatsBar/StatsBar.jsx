import { useState, useEffect, useRef } from 'react';
import './StatsBar.css';

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
    <div className="stats-bar__item">
      <span className="stats-bar__value">{active ? display : 0}{suffix}</span>
      <span className="stats-bar__label">{label}</span>
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
    <div className="stats-bar" ref={ref}>
      <div className="stats-bar__inner">
        {STATS.map((s, i) => (
          <StatItem key={i} {...s} active={active} />
        ))}
      </div>
    </div>
  );
}
