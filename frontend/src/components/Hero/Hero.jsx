"use client";

import SpaceCanvas from "./SpaceCanvas";
import ObjectAnimations from "./ObjectAnimations";
import ProjectionBlobs from "./ProjectionBlobs";
import Countdown from "./Countdown";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen min-h-[100dvh] w-full flex-col items-center justify-between overflow-hidden pt-28 pb-10 px-4 sm:px-6 select-none"
    >
      {/* ── 1. Background Artwork ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/landingPage/space_hero_bg.jpg"
          alt="Space Colony Landscape"
          className="h-full w-full object-cover object-bottom sm:object-center pointer-events-none"
        />
        {/* Subtle contrast gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(7, 11, 25, 0.2) 0%, rgba(7, 11, 25, 0.45) 80%, rgba(7, 11, 25, 0.75) 100%)",
          }}
        />
      </div>

      {/* ── 2. Space Canvas (Shooting Stars & Starfield) ── */}
      <SpaceCanvas />

      {/* ── 3. Live Object Animations (Radar signals, tower beacons, planetary aura) ── */}
      <ObjectAnimations />

      {/* ── 4. Peripheral drone projections ── */}
      <ProjectionBlobs />

      {/* ── 5. Main Center Hero Content ── */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center my-auto">
        {/* PRESENTS */}
        <p className="font-tech text-[0.62rem] sm:text-[0.72rem] tracking-[0.38em] text-white/60 mb-1">
          PRESENTS
        </p>

        {/* THE 10TH EDITION OF */}
        <h2 className="font-tech text-xs sm:text-sm lg:text-base font-bold tracking-[0.24em] text-white/90 mb-3 sm:mb-4">
          THE 10TH EDITION OF
        </h2>

        {/* Cybernetic VIHAAN-X Logo */}
        <div className="relative w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[580px] my-1 sm:my-2 animate-logo-glow">
          <img
            src="/logos/vihaan_full.png"
            alt="VIHAAN-X Hackathon Logo"
            className="w-7xl h-auto object-contain transition-transform duration-500 hover:scale-[1.03]"
          />
        </div>

        {/* NORTH INDIA'S LARGEST STUDENT-RUN HACKATHON */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-4 w-full">
          <span className="h-px w-6 sm:w-12 bg-[#ff3b6c] shrink-0 shadow-[0_0_8px_#ff3b6c]" />
          <p className="text-[0.58rem] sm:text-[0.75rem] lg:text-[0.82rem] font-semibold tracking-[0.22em] text-white/85 uppercase whitespace-nowrap">
            NORTH INDIA&apos;S LARGEST STUDENT&#8209;RUN HACKATHON
          </p>
          <span className="h-px w-6 sm:w-12 bg-[#ff3b6c] shrink-0 shadow-[0_0_8px_#ff3b6c]" />
        </div>
        {/* Action Buttons: REGISTER NOW & PREVIOUS EDITIONS */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {/* Primary CTA: Register Now */}
          <a
            href="#register"
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#ff3b6c] px-7 py-3 text-xs sm:text-[0.8rem] font-bold tracking-[0.16em] text-white transition-all duration-300 shadow-[0_0_24px_rgba(255,59,108,0.65)] hover:bg-[#ff1e56] hover:shadow-[0_0_36px_rgba(255,59,108,0.9)] hover:scale-105 active:scale-95"
          >
            <span>REGISTER NOW</span>
            <svg
              className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>

          {/* Secondary CTA: Scroll to Previous Editions in the gallery */}
          <a
            href="#past-editions"
            className="group relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#070b19]/60 backdrop-blur-md px-6 py-3 text-xs sm:text-[0.8rem] font-bold tracking-[0.16em] text-white/90 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95"
          >
            <span>PREVIOUS EDITIONS</span>
            <svg
              className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        {/* Live Glassmorphic Countdown */}
        <div className="mt-6 sm:mt-8 w-full flex justify-center">
          <Countdown />
        </div>
      </div>

      {/* ── 6. Bottom Scroll Indicator ── */}
      <a
        href="#about"
        className="relative z-10 flex flex-col items-center gap-1.5 pt-4 group cursor-pointer"
        aria-label="Scroll down to About section"
      >
        <p className="text-[0.48rem] sm:text-[0.55rem] font-medium tracking-[0.35em] text-white/35 group-hover:text-white/70 transition-colors uppercase">
          SCROLL TO EXPLORE
        </p>
        <div className="flex h-6 w-3.5 sm:h-7 sm:w-4 items-start justify-center rounded-full border border-white/25 p-0.5 shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:border-cyan-400 transition-colors">
          <span className="h-1.5 w-0.5 animate-bounce rounded-full bg-white/60 group-hover:bg-cyan-300 transition-colors" />
        </div>
      </a>
    </section>
  );
}
