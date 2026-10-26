'use client';
import { useMemo, useRef, useState } from 'react';
import ArchiveMedia from './ArchiveMedia';

// Gallery-specific adaptation of the supplied Viewfinder Flip: dynamic folded widths,
// per-slot perspective, strip translation, rotateY/rotateZ and spring settling.
function springEasing() {
  const damping = 0.82, omega = 2 * Math.PI / 0.8;
  const end = Math.log(1000) / (damping * omega);
  const frequency = omega * Math.sqrt(1 - damping * damping);
  return `linear(${Array.from({ length: 49 }, (_, i) => {
    const t = i / 48 * end;
    return i === 48 ? 1 : (1 - Math.exp(-damping * omega * t) * (Math.cos(frequency * t) + damping * omega / frequency * Math.sin(frequency * t))).toFixed(4);
  }).join(',')})`;
}
const spring = springEasing();

export default function ViewfinderCarousel({ items, onOpen }) {
  const initial = Math.min(1, items.length - 1);
  const [position, setPosition] = useState(initial + 1);
  const [animate, setAnimate] = useState(true);
  const swipe = useRef(null);
  const dragged = useRef(false);
  const loopItems = useMemo(() => items.length ? [items[items.length - 1], ...items, items[0]] : [], [items]);
  const active = items.length ? (position - 1 + items.length) % items.length : 0;
  const step = (delta) => setPosition(current => current + delta);
  const settleLoop = (event) => {
    if (event.target !== event.currentTarget) return;
    if (position !== 0 && position !== items.length + 1) return;
    setAnimate(false);
    setPosition(position === 0 ? items.length : 1);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  };
  if (!items.length) return <p className="text-center text-white/60">Photos coming soon.</p>;
  const item = items[active];
  return <div className="viewfinder" role="region" aria-roledescription="carousel" aria-label="Past VIHAAN moments" tabIndex={0}
    onKeyDown={(e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Home') setPosition(1);
      else if (e.key === 'End') setPosition(items.length);
      else step(e.key === 'ArrowRight' ? 1 : -1);
    }}>
    <div className="viewfinder-window"
      onPointerDown={(e) => { if (e.button !== 0) return; swipe.current = { x: e.clientX, y: e.clientY }; dragged.current = false; }}
      onPointerMove={(e) => {
        if (!swipe.current) return;
        const dx = e.clientX - swipe.current.x, dy = e.clientY - swipe.current.y;
        if (Math.abs(dy) > 35 && Math.abs(dy) > Math.abs(dx)) { swipe.current = null; return; }
        if (Math.abs(dx) > 40) { dragged.current = true; swipe.current = null; step(dx < 0 ? 1 : -1); }
      }}
      onPointerUp={() => { swipe.current = null; }} onPointerCancel={() => { swipe.current = null; }} onPointerLeave={() => { swipe.current = null; }}>
      <div className="viewfinder-stage">
        <div className={`viewfinder-strip${animate ? '' : ' viewfinder-strip-reset'}`} onTransitionEnd={settleLoop} style={{ transform: `translateX(calc(var(--folded-width) * ${-position}))`, '--strip-ease': spring }}>
          {loopItems.map((photo, i) => {
            const side = i < position ? 1 : i > position ? -1 : 0;
            const logicalIndex = (i - 1 + items.length) % items.length;
            return <div key={`${i}-${logicalIndex}`} className="viewfinder-slot" style={{ zIndex: loopItems.length - Math.abs(position - i) }}>
              <div className="viewfinder-holder" style={{ width: i === position ? 'var(--photo-width)' : 'var(--folded-width)', transform: `rotateY(${side * 48}deg) rotateZ(${side * -3}deg)` }}>
                <button type="button" className="viewfinder-photo" aria-current={i === position ? 'true' : undefined} tabIndex={Math.abs(i - position) <= 1 ? 0 : -1}
                  aria-label={`${logicalIndex + 1} of ${items.length}: ${photo.caption || 'Archive photo'}${i === position && photo.src ? ', open photo' : ''}`}
                  onClick={() => { if (dragged.current) { dragged.current = false; return; } if (i === position) onOpen(logicalIndex); else setPosition(i); }}>
                  <ArchiveMedia src={photo.src} alt={photo.alt} />
                </button>
              </div>
            </div>;
          })}
        </div>
      </div>
    </div>
    <p className="viewfinder-caption" aria-live="polite" aria-atomic="true">{[item.caption || 'Event name', item.year || 'Year to be added'].join(' · ')}<span className="sr-only">. Slide {active + 1} of {items.length}</span></p>
    <div className="viewfinder-controls">
      <button type="button" onClick={() => step(-1)} aria-label="Previous slide">‹</button>
      <div className="viewfinder-progress" aria-hidden="true"><span style={{ width: `${100 / items.length}%`, transform: `translateX(${active * 100}%)` }} /></div>
      <button type="button" onClick={() => step(1)} aria-label="Next slide">›</button>
    </div>
  </div>;
}
