'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  if (!items.length) return <p className="text-center text-white/60">Photos coming soon.</p>;
  // Reset positions and pending motion when the number of cards changes.
  return <CarouselTrack key={items.length} items={items} onOpen={onOpen} />;
}

function CarouselTrack({ items, onOpen }) {
  const count = items.length;
  const padding = count > 1 ? Math.max(count, 3) : 0;
  const initial = Math.min(1, items.length - 1);
  const [position, setPosition] = useState(initial + padding);
  const [animate, setAnimate] = useState(true);
  const strip = useRef(null);
  const motion = useRef({ busy: false, target: initial + padding, timer: null, frame: null });
  const swipe = useRef(null);
  const dragged = useRef(false);
  const logicalIndexAt = (index) => ((index - padding) % count + count) % count;
  const loopItems = useMemo(() => Array.from({ length: count + padding * 2 }, (_, i) =>
    items[((i - padding) % count + count) % count]), [items, count, padding]);
  const active = logicalIndexAt(position);

  useEffect(() => {
    const pending = motion.current;
    return () => {
      clearTimeout(pending.timer);
      cancelAnimationFrame(pending.frame);
    };
  }, []);

  const resetTo = (target) => {
    const pending = motion.current;
    const focused = strip.current?.contains(document.activeElement) ? document.activeElement : null;
    const focusPosition = focused?.dataset.slot;
    const shift = target - pending.target;
    pending.target = target;
    setAnimate(false);
    setPosition(target);
    // Commit both strip and holder resets before restoring their transitions.
    pending.frame = requestAnimationFrame(() => {
      if (focusPosition !== undefined && shift) {
        strip.current?.querySelector(`[data-slot="${Number(focusPosition) + shift}"]`)?.focus({ preventScroll: true });
      }
      pending.frame = requestAnimationFrame(() => {
        setAnimate(true);
        pending.busy = false;
      });
    });
  };
  const finishMove = () => {
    const pending = motion.current;
    if (!pending.busy) return;
    clearTimeout(pending.timer);
    const canonical = padding + logicalIndexAt(pending.target);
    if (canonical !== pending.target) resetTo(canonical);
    else pending.busy = false;
  };
  const moveTo = (target) => {
    const pending = motion.current;
    if (count < 2 || pending.busy || target === pending.target) return;
    // Only the immediate endpoint copies can become active.
    if (target < padding - 1 || target > padding + count) return;
    pending.busy = true;
    pending.target = target;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resetTo(padding + logicalIndexAt(target));
      return;
    }
    setPosition(target);
    // transitionend may not fire when motion is interrupted or CSS changes.
    pending.timer = setTimeout(finishMove, 1250);
  };
  const step = (delta) => moveTo(motion.current.target + delta);
  const settleLoop = (event) => {
    if (event.target === event.currentTarget && event.propertyName === 'transform') finishMove();
  };
  const item = items[active];
  return <div className="viewfinder" role="region" aria-roledescription="carousel" aria-label="Past VIHAAN moments" tabIndex={0}
    onKeyDown={(e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Home') moveTo(padding);
      else if (e.key === 'End') moveTo(padding + count - 1);
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
        <div ref={strip} className={`viewfinder-strip${animate ? '' : ' viewfinder-strip-reset'}`} onTransitionEnd={settleLoop} style={{ transform: `translateX(calc(var(--folded-width) * ${-position}))`, '--strip-ease': spring }}>
          {loopItems.map((photo, i) => {
            const side = i < position ? 1 : i > position ? -1 : 0;
            const logicalIndex = logicalIndexAt(i);
            return <div key={`${i}-${logicalIndex}`} className="viewfinder-slot" style={{ zIndex: loopItems.length - Math.abs(position - i) }}>
              <div className="viewfinder-holder" style={{ width: i === position ? 'var(--photo-width)' : 'var(--folded-width)', transform: `rotateY(${side * 48}deg) rotateZ(${side * -3}deg)` }}>
                <button type="button" className="viewfinder-photo" data-slot={i} aria-current={i === position ? 'true' : undefined} tabIndex={Math.abs(i - position) <= 1 ? 0 : -1}
                  aria-label={`${logicalIndex + 1} of ${items.length}: ${photo.caption || 'Archive photo'}${i === position && photo.src ? ', open photo' : ''}`}
                  onClick={() => { if (dragged.current) { dragged.current = false; return; } if (motion.current.busy) return; if (i === position) onOpen(logicalIndex); else moveTo(position + Math.sign(i - position)); }}>
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
      <button type="button" disabled={count < 2} onClick={() => step(-1)} aria-label="Previous slide"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg></button>
      <div className="viewfinder-progress" aria-hidden="true"><span style={{ width: `${100 / items.length}%`, transform: `translateX(${active * 100}%)` }} /></div>
      <button type="button" disabled={count < 2} onClick={() => step(1)} aria-label="Next slide"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg></button>
    </div>
  </div>;
}
