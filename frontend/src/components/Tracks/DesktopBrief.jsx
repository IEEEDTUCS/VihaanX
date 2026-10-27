"use client";

import { Chevron } from "./trackIcons";

const PLACEHOLDER =
  "[One-line brief for this track — to be confirmed by organisers]";

export default function DesktopBrief({
  world,
  current,
  meta,
  num,
  pos,
  total,
  prev,
  next,
}) {
  return (
    // The live region stays mounted; only the article inside is keyed, so the scan line and
    // staggered rise replay on every change while the announcement still fires.
    <div aria-live="polite">
      <article
        key={`${world}-${current.id}`}
        className="brief"
        style={{
          boxSizing: "border-box",
          padding: "26px 28px 24px",
          borderRadius: "24px",
          border: "1px solid color-mix(in srgb, var(--acc) 45%, transparent)",
          background:
            "linear-gradient(160deg, rgba(14,25,64,0.78), rgba(9,17,41,0.72))",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45), 0 0 40px color-mix(in srgb, var(--acc) 14%, transparent)",
        }}
      >
        <span className="scanline scanline-d" aria-hidden="true" />

        <div className="r1-d flex items-center justify-between gap-3">
          <span
            className="font-tech"
            style={{
              fontSize: "11px",
              letterSpacing: "0.28em",
              color: "var(--acc)",
            }}
          >
            TRACK {num} · {meta.name}
          </span>
          <span
            className="font-tech"
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {pos} / {total}
          </span>
        </div>

        <h3
          className="font-tech r2-d"
          style={{
            margin: "12px 0 0",
            fontSize: "34px",
            lineHeight: 1.15,
            fontWeight: 900,
            letterSpacing: "0.04em",
          }}
        >
          {current.name}
        </h3>

        {current.desc ? (
          <p
            className="r3-d"
            style={{
              margin: "10px 0 0",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {current.desc}
          </p>
        ) : (
          <p
            className="r3-d"
            style={{
              margin: "12px 0 0",
              padding: "10px 12px",
              border: "1px dashed rgba(255,255,255,0.28)",
              borderRadius: "10px",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {PLACEHOLDER}
          </p>
        )}

        <div
          className="r4-d flex flex-wrap items-center gap-2.5"
          style={{
            marginTop: "20px",
            paddingTop: "18px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ flex: 1 }} />
          <button
            type="button"
            className="ibtn"
            onClick={prev}
            aria-label="Previous track"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            className="ibtn"
            onClick={next}
            aria-label="Next track"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </article>
    </div>
  );
}
