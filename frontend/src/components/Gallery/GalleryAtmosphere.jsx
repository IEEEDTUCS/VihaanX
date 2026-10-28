'use client';

import { useEffect, useRef } from 'react';

// Lightweight trails inspired by Aceternity's Shooting Stars on 21st.dev.
// CSS handles the motion; the observer suspends it outside the viewport.
export default function GalleryAtmosphere() {
  const atmosphere = useRef(null);
  useEffect(() => {
    const element = atmosphere.current;
    const update = (visible) => element.classList.toggle('atmosphere-running', visible && !document.hidden);
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(visible); });
    const onVisibility = () => update(visible);
    observer.observe(element);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  return <div ref={atmosphere} className="gallery-atmosphere" aria-hidden="true">
    <div className="gallery-boundary gallery-boundary-top" />
    <div className="gallery-stars">
      {Array.from({ length: 72 }, (_, i) => <i key={i} style={{
        '--star-x': `${(i * 37 + 11) % 100}%`,
        '--star-y': `${(i * 61 + 7) % 100}%`,
        '--star-size': `${0.8 + (i % 4) * 0.45}px`,
        '--star-delay': `${(i % 13) * -0.42}s`,
        '--star-duration': `${3.2 + (i % 7) * 0.65}s`,
      }} />)}
    </div>
    <div className="gallery-nebula" />
    <div className="gallery-orbit" />
    <div className="gallery-horizon" />
    {Array.from({ length: 12 }, (_, i) => <i key={i} className="gallery-meteor" style={{ left: `${18 + (i * 23) % 88}%`, top: `${2 + (i * 17) % 86}%`, animationDelay: `${i * -1.85}s`, animationDuration: `${7 + i % 4 * 1.3}s` }} />)}
    <div className="gallery-boundary gallery-boundary-bottom" />
  </div>;
}
