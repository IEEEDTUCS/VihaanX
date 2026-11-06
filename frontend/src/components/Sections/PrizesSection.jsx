"use client";

import { useState, useEffect, useRef } from "react";

const TOTAL_PRIZE_POOL = 150000;
const UNSTOP_URL =
  "https://unstop.com/college-fests/vihaan-x-ieee-dtu-delhi-technological-university-dtu-new-delhi-519244";

function useCountUp(endValue, duration = 1800, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easedProgress * endValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue, duration, shouldStart]);

  return count;
}

export default function PrizesSection() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [focusedTrack, setFocusedTrack] = useState(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animatedPoolAmount = useCountUp(TOTAL_PRIZE_POOL, 2000, isInView);
  const formattedPool = `₹${animatedPoolAmount.toLocaleString("en-IN")}`;

  return (
    <section
      ref={sectionRef}
      id="prizes"
      aria-labelledby="prizes-heading"
      className="relative w-full overflow-hidden bg-[#070b19] px-4 py-24 sm:px-8 sm:py-28 text-white select-none"
    >
      {/* ── 1. Cosmic Atmosphere & Atmospheric Gradients ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[550px] w-[750px] rounded-full bg-gradient-to-b from-[#ff3b6c]/15 via-[#38bdf8]/10 to-transparent blur-[140px]" />
        <div className="absolute top-1/2 -left-48 h-[450px] w-[450px] rounded-full bg-[#38bdf8]/[0.06] blur-[120px]" />
        <div className="absolute top-1/2 -right-48 h-[450px] w-[450px] rounded-full bg-[#ff3b6c]/[0.06] blur-[120px]" />

        {/* Space Grid Lines */}
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(56,189,248,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.15)_1px,transparent_1px)] [background-size:54px_54px]" />

        {/* Floating Space Dust */}
        <div className="absolute inset-0">
          {[
            { top: "18%", left: "14%", size: 3, color: "#38bdf8", delay: 0 },
            { top: "32%", left: "84%", size: 2, color: "#ff3b6c", delay: 1.5 },
            { top: "68%", left: "10%", size: 2.5, color: "#fbbf24", delay: 2.5 },
            { top: "78%", left: "88%", size: 3, color: "#38bdf8", delay: 0.8 },
          ].map((star, i) => (
            <span
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                boxShadow: `0 0 12px ${star.color}`,
                animationDuration: "3s",
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* ── 2. Minimal Section Header ── */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#ff3b6c]/30 bg-[#ff3b6c]/10 text-[#ff3b6c] mb-3.5 shadow-[0_0_15px_rgba(255,59,108,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b6c] animate-ping" />
            <span className="font-tech text-[11px] tracking-[0.25em] uppercase">
              // REWARDS PROTOCOL
            </span>
          </div>

          <h2
            id="prizes-heading"
            className="font-tech text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-white"
          >
            PRIZES & RECOGNITION
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-white/60 max-w-xl font-light tracking-wide">
            ₹1.5 Lakhs total bounty pool across Hardware, Software & Special Category awards.
          </p>
        </div>

        {/* ── 3. THE 1.5L TOTAL PRIZE POOL COSMIC VAULT CARD ── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e163d]/85 via-[#0a102c]/90 to-[#070b19]/95 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(56,189,248,0.12),inset_0_0_60px_rgba(255,59,108,0.08)]">
          {/* Animated Central Gyro Rings in Background */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-96 sm:w-96 rounded-full border border-cyan-400/10 [transform:rotateX(68deg)] animate-[spin_25s_linear_infinite]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 sm:h-72 sm:w-72 rounded-full border border-pink-400/15 [transform:rotateX(68deg)_rotateZ(45deg)] animate-[spin_18s_linear_infinite_reverse]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border border-amber-300/10 [transform:rotateX(68deg)] shadow-[0_0_50px_rgba(251,191,36,0.15)]" />

          {/* Sci-Fi HUD Corner Brackets */}
          <div className="pointer-events-none absolute top-3.5 left-4 font-mono text-[10px] text-cyan-300/60 tracking-widest">
            BOUNTY_CORE // ONLINE
          </div>
          <div className="pointer-events-none absolute top-3.5 right-4 font-mono text-[10px] text-pink-300/60 tracking-widest">
            SEC_LVL // LEVEL_10
          </div>
          <div className="pointer-events-none absolute bottom-3.5 left-4 font-mono text-[10px] text-white/30 tracking-widest hidden sm:block">
            LATENCY // 0.04ms
          </div>
          <div className="pointer-events-none absolute bottom-3.5 right-4 font-mono text-[10px] text-white/30 tracking-widest hidden sm:block">
            STATUS // ALLOCATED_CONFIRMED
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Pulsing Pill */}
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-[11px] tracking-widest uppercase shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>THE GRAND VIHAAN X BOUNTY</span>
            </div>

            {/* Total Pool Title */}
            <p className="font-tech text-xs sm:text-sm font-bold tracking-[0.3em] text-white/60 uppercase mb-1">
              TOTAL CUMULATIVE PRIZE POOL
            </p>

            {/* MASSIVE HERO PRIZE POOL FIGURE */}
            <div className="relative my-2 sm:my-3">
              <span
                className="font-tech text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white block select-text"
                style={{
                  textShadow:
                    "0 0 35px rgba(255, 59, 108, 0.45), 0 0 70px rgba(56, 189, 248, 0.35)",
                }}
              >
                {formattedPool}
              </span>
              <span className="font-tech text-sm sm:text-lg font-bold tracking-[0.25em] text-[#ff3b6c] block mt-1">
                ₹1.5 LAKHS TOTAL REWARD SUM
              </span>
            </div>

            {/* 3-Core Breakdown Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl mt-6 mb-6">
              {/* Hardware Track */}
              <div
                onMouseEnter={() => setFocusedTrack("hardware")}
                onMouseLeave={() => setFocusedTrack(null)}
                className={`group rounded-xl border p-4 text-left transition-all duration-300 ${
                  focusedTrack === "hardware"
                    ? "border-[#38bdf8] bg-[#38bdf8]/15 shadow-[0_0_20px_rgba(56,189,248,0.3)] -translate-y-1"
                    : "border-white/10 bg-white/[0.03] hover:border-[#38bdf8]/50 hover:bg-[#38bdf8]/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] tracking-wider text-cyan-300 uppercase">
                    HARDWARE TRACK
                  </span>
                  <span className="font-mono text-[10px] text-white/40">33.3%</span>
                </div>
                <p className="font-tech text-2xl font-black text-white group-hover:text-cyan-200 transition-colors">
                  ₹50,000
                </p>
                <span className="font-mono text-[10px] text-white/50 block mt-1">
                  1 Champion Winner
                </span>
              </div>

              {/* Software Track */}
              <div
                onMouseEnter={() => setFocusedTrack("software")}
                onMouseLeave={() => setFocusedTrack(null)}
                className={`group rounded-xl border p-4 text-left transition-all duration-300 ${
                  focusedTrack === "software"
                    ? "border-[#ff3b6c] bg-[#ff3b6c]/15 shadow-[0_0_20px_rgba(255,59,108,0.3)] -translate-y-1"
                    : "border-white/10 bg-white/[0.03] hover:border-[#ff3b6c]/50 hover:bg-[#ff3b6c]/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] tracking-wider text-pink-300 uppercase">
                    SOFTWARE TRACK
                  </span>
                  <span className="font-mono text-[10px] text-white/40">46.7%</span>
                </div>
                <p className="font-tech text-2xl font-black text-white group-hover:text-pink-200 transition-colors">
                  ₹70,000
                </p>
                <span className="font-mono text-[10px] text-white/50 block mt-1">
                  Winner + 2 Runners-Up
                </span>
              </div>

              {/* Special Awards */}
              <div
                onMouseEnter={() => setFocusedTrack("special")}
                onMouseLeave={() => setFocusedTrack(null)}
                className={`group rounded-xl border p-4 text-left transition-all duration-300 ${
                  focusedTrack === "special"
                    ? "border-[#818cf8] bg-[#818cf8]/15 shadow-[0_0_20px_rgba(129,140,248,0.3)] -translate-y-1"
                    : "border-white/10 bg-white/[0.03] hover:border-[#818cf8]/50 hover:bg-[#818cf8]/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] tracking-wider text-indigo-300 uppercase">
                    SPECIAL AWARDS
                  </span>
                  <span className="font-mono text-[10px] text-white/40">20.0%</span>
                </div>
                <p className="font-tech text-2xl font-black text-white group-hover:text-indigo-200 transition-colors">
                  ₹30,000
                </p>
                <span className="font-mono text-[10px] text-white/50 block mt-1">
                  3 Prestigious Categories
                </span>
              </div>
            </div>

            {/* Bounty Spectrum Visual Bar */}
            <div className="w-full max-w-3xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-2">
                <span>INTERACTIVE BOUNTY SPECTRUM</span>
                <span className="text-[#38bdf8] font-semibold">
                  {focusedTrack === "hardware"
                    ? "HARDWARE: ₹50,000 (33.3%)"
                    : focusedTrack === "software"
                    ? "SOFTWARE: ₹70,000 (46.7%)"
                    : focusedTrack === "special"
                    ? "SPECIAL AWARDS: ₹30,000 (20.0%)"
                    : "HOVER TRACKS TO INSPECT"}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-black/60 p-0.5 border border-white/15 flex overflow-hidden">
                <div
                  onMouseEnter={() => setFocusedTrack("hardware")}
                  onMouseLeave={() => setFocusedTrack(null)}
                  className={`h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 ${
                    focusedTrack === "hardware" ? "brightness-150 scale-y-125" : ""
                  }`}
                  style={{ width: "33.33%" }}
                  title="Hardware Track: ₹50,000 (33.3%)"
                />
                <div
                  onMouseEnter={() => setFocusedTrack("software")}
                  onMouseLeave={() => setFocusedTrack(null)}
                  className={`h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300 ${
                    focusedTrack === "software" ? "brightness-150 scale-y-125" : ""
                  }`}
                  style={{ width: "46.67%" }}
                  title="Software Track: ₹70,000 (46.7%)"
                />
                <div
                  onMouseEnter={() => setFocusedTrack("special")}
                  onMouseLeave={() => setFocusedTrack(null)}
                  className={`h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-300 ${
                    focusedTrack === "special" ? "brightness-150 scale-y-125" : ""
                  }`}
                  style={{ width: "20.00%" }}
                  title="Special Awards: ₹30,000 (20.0%)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Clean Action Link to Unstop ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff3b6c] to-[#ff5782] text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(255,59,108,0.5)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,59,108,0.7)] hover:scale-105"
          >
            <span>VIEW FULL DETAILS & BREAKDOWN ON UNSTOP</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
