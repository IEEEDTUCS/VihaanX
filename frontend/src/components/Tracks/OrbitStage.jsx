"use client";

import WorldPlanet, { MINI_GLOBE_BG } from "./WorldPlanet";

const INNER_DUR = 90;
const OUTER_DUR = 144;

export default function OrbitStage({
  world,
  selected,
  travelTick,
  meta,
  otherMeta,
  rings,
  countLabel,
  current,
  selectWorld,
  selectTrack,
}) {
  const node = ({ track, i, ring, x, y }, dur) => {
    const on = track.id === selected;
    return (
      <div
        key={track.id}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: 0,
          height: 0,
        }}
      >
        <div className="spin-rev" style={{ animationDuration: `${dur}s` }}>
          <button
            type="button"
            className={on ? "node-m is-active" : "node-m"}
            onClick={() => selectTrack(world, track.id)}
            aria-pressed={on}
            aria-label={`${track.name}${on ? ", selected" : ""}`}
          >
            <span
              className="nin"
              style={{ animationDelay: `${350 + ring * 260 + i * 90}ms` }}
            >
              <span className="dot" />
              <span className="lbl">{track.name}</span>
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="stage mx-auto">
      <span
        className="font-tech"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: "-4px",
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.64)",
        }}
      >
        ORBIT MAP // {meta.code}
      </span>
      <span
        className="font-tech"
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: "-4px",
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.64)",
        }}
      >
        {countLabel} NODES
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "4%",
          right: "4%",
          top: "50%",
          height: "1px",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "4%",
          bottom: "4%",
          left: "50%",
          width: "1px",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* keyed on the world: the whole system warps in and the nodes pop in again */}
      <div
        className="warp"
        key={world}
        style={{ position: "absolute", inset: 0 }}
      >
        <div
          aria-hidden="true"
          className="ticks ticks-m"
          style={{ left: "3%", top: "3%", width: "94%", height: "94%" }}
        />
        <div
          aria-hidden="true"
          className="radar"
          style={{ left: "8%", top: "8%", width: "84%", height: "84%" }}
        />
        <div
          aria-hidden="true"
          className="aura-m"
          style={{
            position: "absolute",
            left: "28%",
            top: "28%",
            width: "44%",
            height: "44%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--acc) 40%, transparent) 0%, transparent 70%)",
            filter: "blur(14px)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "37%",
            top: "33%",
            width: "26%",
            height: "26%",
          }}
        >
          <WorldPlanet world={world} scale="sm" />
        </div>

        <div
          className="spin"
          style={{
            position: "absolute",
            left: "24%",
            top: "24%",
            width: "52%",
            height: "52%",
            borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.18)",
            boxSizing: "border-box",
            animationDuration: `${INNER_DUR}s`,
          }}
        >
          {rings.inner.map((n) => node(n, INNER_DUR))}
        </div>
        <div
          className="spin ccw"
          style={{
            position: "absolute",
            left: "8%",
            top: "8%",
            width: "84%",
            height: "84%",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            boxSizing: "border-box",
            animationDuration: `${OUTER_DUR}s`,
          }}
        >
          {rings.outer.map((n) => node(n, OUTER_DUR))}
        </div>
      </div>

      {/* selected-track readout under the planet; re-mounts with a rise on every change */}
      <div
        className="readout"
        key={`ro-${world}-${current.id}`}
        aria-hidden="true"
      >
        <span className="font-tech ro-name">{current.name}</span>
      </div>

      {travelTick > 0 && (
        <span className="comet-m fwd-m" key={travelTick} aria-hidden="true" />
      )}

      <button
        type="button"
        className="mini"
        onClick={() => selectWorld(otherMeta.key)}
        aria-label={`Travel to the ${otherMeta.name === "HARDWARE" ? "Hardware" : "Software"} world, ${
          otherMeta.key === "software" ? 9 : 5
        } tracks`}
        style={{ "--macc": otherMeta.acc }}
      >
        <span
          className="mini-globe"
          style={{ background: MINI_GLOBE_BG[otherMeta.key] }}
        />
        <span className="mini-lbl">{otherMeta.name} →</span>
      </button>
    </div>
  );
}
