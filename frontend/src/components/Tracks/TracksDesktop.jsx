"use client";

import DesktopBrief from "./DesktopBrief";
import OrbitMap from "./OrbitMap";
import TrackGrid from "./TrackGrid";
import { WORLDS } from "@/data/tracks";

export default function TracksDesktop(v) {
  const worldTab = (key) => {
    const w = WORLDS[key];
    const on = v.world === key;
    return (
      <button
        type="button"
        className={on ? "tab-d on" : "tab-d"}
        onClick={() => v.selectWorld(key)}
        aria-pressed={on}
        style={{ "--tacc": w.acc }}
      >
        <span
          className="font-tech flex items-center gap-2"
          style={{
            fontSize: "10px",
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span className="tdot" />
          {w.code}
        </span>
        <span
          className="font-tech"
          style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "0.1em" }}
        >
          {w.name}
        </span>
        <span
          style={{
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {key === "software" ? "09" : "05"} TRACKS
        </span>
      </button>
    );
  };

  return (
    <div className="dwrap">
      <header className="reveal flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0" style={{ flex: "1 1 560px" }}>
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#ff3b6c] shadow-[0_0_8px_#ff3b6c]" />
            <span
              className="font-tech"
              style={{
                fontSize: "12px",
                letterSpacing: "0.3em",
                color: "#ff3b6c",
              }}
            >
              // DOMAINS OF INNOVATION
            </span>
          </div>
          <h2
            id="tracks-title-d"
            className="font-tech"
            style={{
              margin: 0,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "0.05em",
            }}
          >
            HACKATHON TRACKS
          </h2>
          <p
            style={{
              margin: "16px 0 0",
              maxWidth: "580px",
              fontSize: "17px",
              lineHeight: 1.65,
              fontWeight: 300,
              color: "rgba(255,255,255,0.74)",
            }}
          >
            Two worlds to build on. Pick a world, then pick the track your idea
            calls home.
          </p>
        </div>
        <div
          role="group"
          aria-label="Choose a world"
          className="flex flex-wrap gap-3"
        >
          {worldTab("software")}
          {worldTab("hardware")}
        </div>
      </header>

      <div className="dmain">
        <OrbitMap {...v} />

        {/* .dcol carries z-index 1, so node labels that swing past the scene box pass behind
            the brief panel instead of over its text. */}
        <div className="dcol">
          <DesktopBrief {...v} />

          <div className="flex items-center gap-3">
            <span
              className="font-tech"
              style={{
                fontSize: "11px",
                letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {v.meta.name} TRACKS · {v.countLabel}
            </span>
            <span
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.1)",
              }}
            />
          </div>

          <TrackGrid {...v} />
        </div>
      </div>
    </div>
  );
}
