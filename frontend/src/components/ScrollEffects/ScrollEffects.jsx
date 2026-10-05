'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollEffects — GSAP ScrollTrigger parallax + 3D perspective
 *
 * Layers (slowest → fastest parallax = furthest → closest):
 *  - Background video/image     : slowest (0.15x)  — deep space
 *  - Planet (right)             : slow    (0.25x)  — far
 *  - Globe (left)               : slow    (0.20x)  — far
 *  - Sidebar text               : medium  (0.40x)  — mid
 *  - Hero logo + text           : medium  (0.50x)  — mid
 *  - Astronaut                  : faster  (0.70x)  — close
 *  - Navbar                     : fixed (no scroll)
 *
 * Also adds:
 *  - Hero entrance: staggered fade+slide-up on load
 *  - Scroll-scrubbed scale on planet (grows slightly as you scroll)
 *  - Countdown block fades in from below
 *  - Horizontal drift on sidebar text
 */
export default function ScrollEffects() {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let gsap, ScrollTrigger;

    const init = async () => {
      const gsapModule = await import('gsap');
      const stModule   = await import('gsap/ScrollTrigger');

      gsap = gsapModule.gsap || gsapModule.default;
      ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      // ── Desktop only (≥1024px) ──────────────────────────────────
      mm.add('(min-width: 1024px)', () => {

        // 1. Background parallax — very slow, creates depth
        gsap.to('.parallax-bg', {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });

        // 2. Planet (right) — slow parallax + slight scale growth
        gsap.to('.parallax-planet', {
          y: '-8vh',
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '50% top',
            scrub: 2,
          },
        });

        // 3. Globe (left) — parallax down (moves out of view)
        gsap.to('.parallax-globe', {
          y: '6vh',
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '50% top',
            scrub: 2.5,
          },
        });

        // 4. Astronaut — closest layer, moves fastest
        gsap.to('.parallax-astronaut', {
          y: '-18vh',
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '50% top',
            scrub: 0.8,
          },
        });

        // 5. Hero center content — medium parallax + fade out
        gsap.to('.parallax-hero-content', {
          y: '-12vh',
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '35% top',
            scrub: 1,
          },
        });

        // 6. Left sidebar — drifts left + fades
        gsap.to('.parallax-sidebar-left', {
          x: '-3vw',
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '30% top',
            scrub: 1.2,
          },
        });

        // 7. Right sidebar — drifts right + fades
        gsap.to('.parallax-sidebar-right', {
          x: '3vw',
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '30% top',
            scrub: 1.2,
          },
        });

        // 8. Stars video — subtle scale for depth illusion
        gsap.to('.parallax-stars', {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom top',
            scrub: 3,
          },
        });

      });

      // ── All screen sizes ────────────────────────────────────────

      // 9. Horizontal mouse parallax on hero content
      const handleMouse = (e) => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx; // -1 to 1
        const dy = (e.clientY - cy) / cy;

        gsap.to('.parallax-hero-content', {
          x: dx * -8,
          y: dy * -5,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        gsap.to('.parallax-planet', {
          x: dx * 12,
          duration: 2,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        gsap.to('.parallax-globe', {
          x: dx * -10,
          duration: 2,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        gsap.to('.parallax-astronaut', {
          x: dx * 6,
          y: dy * 4,
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      window.addEventListener('mousemove', handleMouse, { passive: true });

      return () => {
        window.removeEventListener('mousemove', handleMouse);
        mm.revert();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    };

    init();
  }, []);

  return null; // purely imperative — no DOM of its own
}
