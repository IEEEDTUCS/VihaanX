"use client";

import WorldPlanet from "./WorldPlanet";

const SCENE = { w: 600, h: 760 };
const CENTER = { x: 255, y: 310 };
const CORNER = { x: 524, y: 684 };
const ACTIVE_SIZE = 150;
const IDLE_SIZE = 96;
const INNER_DUR = 90;
const OUTER_DUR = 144;
const PATH = "M 524 684 C 610 560, 520 400, 255 310";

const slot = (isActive) => {
  const size = isActive ? ACTIVE_SIZE : IDLE_SIZE;
  const c = isActive ? CENTER : CORNER;
  return {
    left: `${c.x - size / 2}px`,
    top: `${c.y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
};

const bracket = (pos) => ({
  position: "absolute",
  width: "22px",
  height: "22px",
  [pos.includes("left") ? "left" : "right"]: 0,
  [pos.includes("top") ? "top" : "bottom"]: 0,
  [pos.includes("left") ? "borderLeft" : "borderRight"]:
    "1px solid rgba(255,255,255,0.35)",
  [pos.includes("top") ? "borderTop" : "borderBottom"]:
    "1px solid rgba(255,255,255,0.35)",
});

export default function OrbitMap({
  world,
  selected,
  travelTick,
  meta,
  otherMeta,
  rings,
  countLabel,
  acc,
  otherAcc,
  selectWorld,
  selectTrack,
}) {
  const node = ({ track, i, ring, num, x, y }, dur) => {
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
            className={on ? "node-d is-active" : "node-d"}
            onClick={() => selectTrack(world, track.id)}
            aria-pressed={on}
            aria-label={`Track ${num}, ${track.name}${on ? ", selected" : ""}`}
            style={{
              animationDelay: `${(travelTick > 0 ? 650 : 300) + ring * 260 + i * 90}ms`,
            }}
          >
            <span className="ndot" />
            <span className="nlbl">{track.name}</span>
          </button>
        </div>
      </div>
    );
  };

  const worldButton = (key) => {
    const w = key === world ? meta : otherMeta;
    const on = key === world;
    return (
      <button
        type="button"
        className={on ? "world on" : "world off"}
        onClick={() => selectWorld(key)}
        aria-pressed={on}
        aria-label={`${w.name} world, ${key === "software" ? 9 : 5} tracks`}
        style={{ "--wacc": w.acc, ...slot(on) }}
      >
        <span className="globe" aria-hidden="true">
          <WorldPlanet world={key} scale="lg" aura />
        </span>
        <span className="plate" style={{ top: "calc(100% + 12px)" }}>
          <span
            className="font-tech flex items-center gap-2"
            style={{ fontSize: "9px", letterSpacing: "0.28em", color: w.acc }}
          >
            <span className="pdot" />
            {w.code}
          </span>
          <span
            className="font-tech"
            style={{
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "0.14em",
            }}
          >
            {w.name}
          </span>
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {key === "software" ? "09" : "05"} TRACKS
          </span>
        </span>
      </button>
    );
  };

  return (
    // .scene-box reserves the scaled footprint; .scene is scaled in place from its top-left
    // corner, so every hardcoded offset inside it — rings, planets, SVG path, comet — scales
    // together and nothing has to be re-measured.
    <div className="scene-box">
      <div
        className="scene"
        role="group"
        aria-label="Choose a world and a track"
        style={{ width: `${SCENE.w}px`, height: `${SCENE.h}px` }}
      >
        {/* graph-paper grid, masked around the system centre */}
        <div
          aria-hidden="true"
          className="vgrid"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "255px 310px",
            WebkitMask:
              "radial-gradient(circle at 255px 310px, #000 30%, transparent 72%)",
            mask: "radial-gradient(circle at 255px 310px, #000 30%, transparent 72%)",
          }}
        />
        {/* crosshair */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            width: "520px",
            top: "310px",
            height: "1px",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "40px",
            height: "540px",
            left: "255px",
            width: "1px",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        {/* corner brackets */}
        <span aria-hidden="true" style={bracket("left-top")} />
        <span aria-hidden="true" style={bracket("right-top")} />
        <span aria-hidden="true" style={bracket("left-bottom")} />
        <span aria-hidden="true" style={bracket("right-bottom")} />
        {/* HUD labels */}
        <span
          className="font-tech"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "32px",
            top: "4px",
            fontSize: "10px",
            letterSpacing: "0.24em",
            color: "rgba(255,255,255,0.62)",
          }}
        >
          ORBIT MAP // {meta.code}
        </span>
        <span
          className="font-tech"
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "32px",
            top: "4px",
            fontSize: "10px",
            letterSpacing: "0.24em",
            color: "rgba(255,255,255,0.62)",
          }}
        >
          {countLabel} NODES
        </span>

        {/* tick ring + radar sweep; keyed so it warps in on every world change */}
        <div className="system warp" key={`dial-${world}`} aria-hidden="true">
          <div
            className="ticks"
            style={{ left: 0, top: "55px", width: "510px", height: "510px" }}
          />
          <div
            className="radar"
            style={{
              left: "25px",
              top: "80px",
              width: "460px",
              height: "460px",
            }}
          />
        </div>

        {/* transfer path between the corner slot and the centre */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${SCENE.w} ${SCENE.h}`}
          width={SCENE.w}
          height={SCENE.h}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <defs>
            <linearGradient id="vxt-traj" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={otherAcc} />
              <stop offset="1" stopColor={acc} />
            </linearGradient>
          </defs>
          <path
            d={PATH}
            fill="none"
            stroke="url(#vxt-traj)"
            strokeOpacity="0.16"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d={PATH}
            fill="none"
            stroke="url(#vxt-traj)"
            strokeWidth="2"
            strokeDasharray="2 10"
            strokeLinecap="round"
            style={{ animation: "vxt-dash 6s linear infinite" }}
          />
        </svg>
        <span className="idler fwd-d" aria-hidden="true" />
        {/* the comet plays once per world change; the changing key replays it */}
        {travelTick > 0 && (
          <span className="comet-d fwd-d" key={travelTick} aria-hidden="true" />
        )}

        {/* The planets must stay OUTSIDE any keyed subtree, or they would remount and jump
            instead of travelling between the centre and the corner slot. */}
        {worldButton("software")}
        {worldButton("hardware")}

        {/* orbit rings; keyed so they warp in and the nodes pop in again after a travel */}
        <div className="system warp" key={`rings-${world}`}>
          <div
            className="oring spin"
            style={{
              left: "105px",
              top: "160px",
              width: "300px",
              height: "300px",
              border: "1px dashed rgba(255,255,255,0.2)",
              animationDuration: `${INNER_DUR}s`,
            }}
          >
            {rings.inner.map((n) => node(n, INNER_DUR))}
          </div>
          <div
            className="oring spin ccw"
            style={{
              left: "40px",
              top: "95px",
              width: "430px",
              height: "430px",
              border: "1px solid rgba(255,255,255,0.12)",
              animationDuration: `${OUTER_DUR}s`,
            }}
          >
            {rings.outer.map((n) => node(n, OUTER_DUR))}
          </div>
        </div>

        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "32px",
            bottom: "4px",
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.62)",
          }}
        >
          SELECT A WORLD TO TRAVEL
        </span>
      </div>
    </div>
  );
}
