'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollEffects — mouse parallax only
 * Fixed elements (planet, globe, astronaut) stay fixed — no scroll drift
 * Only hero text + bg have subtle mouse parallax for 3D depth feel
 */
export default function ScrollEffects() {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      const { gsap } = await import('gsap');

      let mouseRaf;

      const handleMouse = (e) => {
        cancelAnimationFrame(mouseRaf);
        mouseRaf = requestAnimationFrame(() => {
          const cx = window.innerWidth  / 2;
          const cy = window.innerHeight / 2;
          const dx = (e.clientX - cx) / cx; // -1 to 1
          const dy = (e.clientY - cy) / cy;

          // Hero text — subtle drift for depth
          gsap.to('.parallax-hero-content', {
            x: dx * -8, y: dy * -5,
            duration: 1.4, ease: 'power2.out', overwrite: 'auto',
          });

          // Background — very subtle opposite drift (deepest layer)
          gsap.to('.parallax-bg', {
            x: dx * -5, y: dy * -3,
            duration: 2.5, ease: 'power2.out', overwrite: 'auto',
          });

          // Stars — slightly more than bg
          gsap.to('.parallax-stars', {
            x: dx * -7, y: dy * -4,
            duration: 2.0, ease: 'power2.out', overwrite: 'auto',
          });

          // Sidebar — gentle drift
          gsap.to('.parallax-sidebar-left', {
            x: dx * -4,
            duration: 1.8, ease: 'power2.out', overwrite: 'auto',
          });
        });
      };

      window.addEventListener('mousemove', handleMouse, { passive: true });

      return () => {
        cancelAnimationFrame(mouseRaf);
        window.removeEventListener('mousemove', handleMouse);
      };
    };

    init();
  }, []);

  return null;
}
