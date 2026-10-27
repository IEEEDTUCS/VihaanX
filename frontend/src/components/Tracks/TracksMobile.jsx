"use client";

import { useRef } from "react";
import ChipStrip from "./ChipStrip";
import MobileBrief from "./MobileBrief";
import OrbitStage from "./OrbitStage";
import { WORLDS } from "@/data/tracks";

const ORDER = ["software", "hardware"];

export default function TracksMobile(v) {
  const tabRefs = useRef({});

  // The design uses the ARIA tabs pattern, so the tablist also answers arrow keys.
  const onTabKeyDown = (e) => {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const nextKey =
      ORDER[(ORDER.indexOf(v.world) + dir + ORDER.length) % ORDER.length];
    v.selectWorld(nextKey);
    tabRefs.current[nextKey]?.focus();
  };

  const tab = (key) => {
    const w = WORLDS[key];
    const on = v.world === key;
    return (
      <button
        ref={(el) => {
          tabRefs.current[key] = el;
        }}
        type="button"
        role="tab"
        id={`tracks-tab-${key}`}
        aria-controls="tracks-panel"
        aria-selected={on}
        tabIndex={on ? 0 : -1}
        className={on ? "tab-m on" : "tab-m"}
        onClick={() => v.selectWorld(key)}
        style={{ "--tacc": w.acc }}
      >
        <span
          className="font-tech flex items-center gap-1.5"
          style={{
            fontSize: "9px",
            letterSpacing: "0.24em",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span className="tdot" />
          {w.code}
        </span>
        <span
          className="font-tech"
          style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "0.08em" }}
        >
          {w.name}
        </span>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {key === "software" ? "09" : "05"} TRACKS
        </span>
      </button>
    );
  };

  return (
    <div
      className="relative mx-auto flex max-w-[420px] flex-col"
      style={{ gap: "20px" }}
    >
      <header>
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="h-px w-6 bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
          <span
            className="font-tech"
            style={{
              fontSize: "10px",
              letterSpacing: "0.28em",
              color: "#ff3b6c",
            }}
          >
            // DOMAINS OF INNOVATION
          </span>
        </div>
        <h2
          id="tracks-title-m"
          className="font-tech"
          style={{
            margin: 0,
            fontSize: "30px",
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: "0.05em",
          }}
        >
          HACKATHON TRACKS
        </h2>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "14px",
            lineHeight: 1.55,
            fontWeight: 300,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          Two worlds, fourteen tracks. Tap a node on the orbit to see its track.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Track sectors"
        onKeyDown={onTabKeyDown}
        className="grid grid-cols-2 gap-2.5"
      >
        {tab("software")}
        {tab("hardware")}
      </div>

      <div
        id="tracks-panel"
        role="tabpanel"
        aria-labelledby={`tracks-tab-${v.world}`}
        className="flex flex-col"
        style={{ gap: "16px" }}
      >
        <OrbitStage {...v} />

        <MobileBrief {...v} />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="font-tech"
              style={{
                fontSize: "9px",
                letterSpacing: "0.24em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              ALL {v.meta.name} TRACKS
            </span>
            <span
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <span
              className="font-tech"
              aria-hidden="true"
              style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.62)",
              }}
            >
              SWIPE →
            </span>
          </div>
          <ChipStrip {...v} />
        </div>
      </div>

      <aside
        aria-label="Open Innovation"
        className="flex items-center gap-3"
        style={{
          padding: "14px 14px 14px 16px",
          borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(9,17,41,0.55)",
        }}
      >
        <p
          className="min-w-0 flex-1"
          style={{
            margin: 0,
            fontSize: "13px",
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          Can&apos;t find your track? Try Open Innovation.
        </p>
        <button
          type="button"
          className="ghost-m"
          onClick={() => v.openInnovation(v.world)}
        >
          OPEN INNOVATION
        </button>
      </aside>
    </div>
  );
}
