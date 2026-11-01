"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { eventLeads, departmentLeads } from "../../data/team";

/* eslint-disable no-unused-vars */
// Background space particles
function SpaceAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-[#ff3b6c]/10 blur-[130px]" />
      <div className="absolute top-2/3 -right-32 h-80 w-80 rounded-full bg-[#38bdf8]/10 blur-[130px]" />
    </div>
  );
}

// =========================================================================
// 1. EVENT LEADS (4 Prominent Command Cards with Big Portrait Display)
// =========================================================================
function EventLeadsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
      {eventLeads.map((lead) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="group relative flex flex-col rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1433]/90 via-[#091129]/95 to-[#070b19] p-3.5 sm:p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/35"
          style={{
            boxShadow: `0 0 35px -12px ${lead.glowColor}`,
          }}
        >
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2.5">
            <span
              className="font-mono text-[0.68rem] tracking-widest font-bold uppercase flex items-center gap-1.5"
              style={{ color: lead.color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-ping"
                style={{ backgroundColor: lead.color }}
              />
              {lead.planetName}
            </span>
            <span className="font-mono text-[0.62rem] tracking-widest px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60">
              {lead.code}
            </span>
          </div>

          {/* Big Heroic Portrait Window */}
          <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/15 bg-[#050914]">
            {/* Ambient Back Glow */}
            <div
              className="absolute inset-0 opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40"
              style={{ backgroundColor: lead.color }}
            />

            {/* Real Big Photo */}
            <img
              src={lead.image}
              alt={lead.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />

            {/* Subtle sci-fi gradient vignette at base */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-transparent opacity-60" />

            {/* Cyberpunk corner accents */}
            <div
              className="absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 opacity-80"
              style={{ borderColor: lead.color }}
            />
            <div
              className="absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 opacity-80"
              style={{ borderColor: lead.color }}
            />
            <div
              className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 opacity-80"
              style={{ borderColor: lead.color }}
            />
            <div
              className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 opacity-80"
              style={{ borderColor: lead.color }}
            />
          </div>

          {/* Officer Identity & Comms */}
          <div className="pt-4 px-2 pb-1 flex flex-col flex-1 justify-between">
            <div>
              <h3 className="font-tech text-xl sm:text-2xl font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                {lead.name}
              </h3>
              <p
                className="font-mono text-xs uppercase font-bold tracking-wider mt-0.5"
                style={{ color: lead.color }}
              >
                {lead.role}
              </p>
              <p className="font-mono text-[0.68rem] text-white/50 tracking-wider mt-0.5">
                // {lead.tagline}
              </p>
            </div>

          </div>
        </motion.div>
      ))}
    </div>
  );
}

// =========================================================================
// 2. DEPARTMENT LEADS (Continuous Orbital Drift + Big Portrait Cards)
// =========================================================================
function DeptLeadsCarousel() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Smooth continuous right-to-left drift that seamlessly loops
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId;
    const speed = 0.75; // Drift speed in pixels per frame

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // Halfway loop point (since list is duplicated)
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  const scrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Duplicate items for seamless continuous looping
  const duplicatedLeads = [...departmentLeads, ...departmentLeads];

  return (
    <div className="relative w-full">
      {/* Drift Carousel Track */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-3 px-1 select-none cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedLeads.map((lead, idx) => (
          <div
            key={`${lead.id}-${idx}`}
            className="group relative w-[250px] sm:w-[270px] shrink-0 rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1433]/90 via-[#091129]/95 to-[#070b19] p-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/35"
            style={{
              boxShadow: `0 0 30px -12px ${lead.color}40`,
            }}
          >
            {/* Top Telemetry Header */}
            <div className="flex items-center justify-between px-1.5 pb-2">
              <span
                className="font-mono text-[0.62rem] tracking-widest font-bold uppercase"
                style={{ color: lead.color }}
              >
                {lead.planet}
              </span>
              <span className="font-mono text-[0.58rem] tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60">
                {lead.role}
              </span>
            </div>

            {/* Big Portrait Photo */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-white/15 bg-[#050914]">
              {/* Back Glow */}
              <div
                className="absolute inset-0 opacity-15 blur-lg transition-opacity duration-300 group-hover:opacity-35"
                style={{ backgroundColor: lead.color }}
              />

              <img
                src={lead.image}
                alt={lead.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Vignette at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-transparent opacity-60" />

              {/* Cyber corner marks */}
              <div
                className="absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 opacity-70"
                style={{ borderColor: lead.color }}
              />
              <div
                className="absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 opacity-70"
                style={{ borderColor: lead.color }}
              />
              <div
                className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 opacity-70"
                style={{ borderColor: lead.color }}
              />
              <div
                className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 opacity-70"
                style={{ borderColor: lead.color }}
              />
            </div>

            {/* Information */}
            <div className="pt-3 px-1.5 pb-0.5 flex flex-col justify-between">
              <div>
                <h4 className="font-tech text-lg sm:text-xl font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  {lead.name}
                </h4>
                <p
                  className="font-mono text-[0.7rem] uppercase font-bold tracking-wider mt-0.5"
                  style={{ color: lead.color }}
                >
                  {lead.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// MAIN TEAM SECTION COMPONENT
// =========================================================================
export default function TeamSection() {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "event" | "dept"

  return (
    <section
      id="team"
      className="relative w-full flex flex-col justify-center px-4 sm:px-8 py-20 sm:py-24 bg-gradient-to-b from-[#070b19] via-[#091129] to-[#070b19] overflow-hidden"
    >
      <SpaceAtmosphere />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header Tag */}
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
          <span className="font-tech text-xs tracking-[0.3em] text-[#ff3b6c] uppercase">
            // CELESTIAL CADRE
          </span>
        </div>

        {/* Section Heading & View Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
          <div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black tracking-wider text-white">
              ORGANIZING CREW
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/65 font-light max-w-xl">
              Meet the mission commanders and domain architects steering Vihaan X.
            </p>
          </div>

          {/* View Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-[#0c1433]/70 backdrop-blur-md self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[0.68rem] tracking-wider transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-[#ff3b6c] to-[#ff5795] text-white font-bold shadow-[0_0_15px_rgba(255,59,108,0.4)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ALL CREW
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("event")}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[0.68rem] tracking-wider transition-all cursor-pointer ${
                activeTab === "event"
                  ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              EVENT LEADS ({eventLeads.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dept")}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[0.68rem] tracking-wider transition-all cursor-pointer ${
                activeTab === "dept"
                  ? "bg-purple-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              DEPT LEADS ({departmentLeads.length})
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: EVENT LEADS (4 Prominent Command Cards)                */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "event") && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
                <h3 className="font-tech text-lg sm:text-xl font-bold tracking-wider text-white">
                  EVENT LEADS
                </h3>
              </div>
            </div>

            <EventLeadsGrid />
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: DEPARTMENT LEADS (Continuous Orbital Conveyor Drift)   */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "dept") && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <h3 className="font-tech text-lg sm:text-xl font-bold tracking-wider text-white">
                  DEPARTMENT LEADS
                </h3>
                  </div>
            </div>

            <DeptLeadsCarousel />
          </div>
        )}
      </div>
    </section>
  );
}
