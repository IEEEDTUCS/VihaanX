'use client';

import { useEffect, useRef } from 'react';

export default function ScrollEffects() {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {

        const hero = document.querySelector('section');
        if (!hero) return;

        // Background — drifts up slowly (deepest layer)
        gsap.to('.parallax-bg', {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 2 },
        });

        // Stars — subtle scale zoom
        gsap.to('.parallax-stars', {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 3 },
        });

        // Planet — floats up + grows slightly as you scroll
        gsap.to('.parallax-planet', {
          y: '-10vh',
          scale: 1.08,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 },
        });

        // Globe — sinks down (opposite to planet)
        gsap.to('.parallax-globe', {
          y: '8vh',
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 2 },
        });

        // Astronaut — fastest, creates closest-layer illusion
        gsap.to('.parallax-astronaut', {
          y: '-22vh',
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
        });

        // Hero content — fades + rises as you scroll away
        gsap.to('.parallax-hero-content', {
          y: '-14vh',
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: 1 },
        });

        // Left sidebar — drifts left + fades
        gsap.to('.parallax-sidebar-left', {
          x: '-4vw',
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '50% top', scrub: 1.2 },
        });

      });

      // ── Mouse parallax — all screens ──────────────────────────
      let mouseRaf;
      const handleMouse = (e) => {
        cancelAnimationFrame(mouseRaf);
        mouseRaf = requestAnimationFrame(() => {
          const cx = window.innerWidth  / 2;
          const cy = window.innerHeight / 2;
          const dx = (e.clientX - cx) / cx;
          const dy = (e.clientY - cy) / cy;

          gsap.to('.parallax-hero-content', {
            x: dx * -10, y: dy * -6,
            duration: 1.4, ease: 'power2.out', overwrite: 'auto',
          });
          gsap.to('.parallax-planet', {
            x: dx * 18, y: dy * 8,
            duration: 2.2, ease: 'power2.out', overwrite: 'auto',
          });
          gsap.to('.parallax-globe', {
            x: dx * -12, y: dy * -6,
            duration: 2, ease: 'power2.out', overwrite: 'auto',
          });
          gsap.to('.parallax-astronaut', {
            x: dx * 8, y: dy * 5,
            duration: 1.6, ease: 'power2.out', overwrite: 'auto',
          });
          gsap.to('.parallax-bg', {
            x: dx * -6, y: dy * -4,
            duration: 2.5, ease: 'power2.out', overwrite: 'auto',
          });
          gsap.to('.parallax-sidebar-left', {
            x: dx * -5,
            duration: 1.8, ease: 'power2.out', overwrite: 'auto',
          });
        });
      };

      window.addEventListener('mousemove', handleMouse, { passive: true });

      return () => {
        cancelAnimationFrame(mouseRaf);
        window.removeEventListener('mousemove', handleMouse);
        mm.revert();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    };

    init();
  }, []);

  return null;
}
