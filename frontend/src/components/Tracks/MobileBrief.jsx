"use client";

import { ArrowRight, Chevron } from "./trackIcons";

const PLACEHOLDER = "[Track brief — to be confirmed by organisers]";

export default function MobileBrief({
  world,
  current,
  meta,
  pos,
  total,
  prev,
  next,
}) {
  return (
    <div aria-live="polite">
      <article
        key={`${world}-${current.id}`}
        className="brief"
        style={{
          boxSizing: "border-box",
          padding: "18px 18px 16px",
          borderRadius: "20px",
          border: "1px solid color-mix(in srgb, var(--acc) 45%, transparent)",
          background:
            "linear-gradient(160deg, rgba(14,25,64,0.78), rgba(9,17,41,0.72))",
          boxShadow:
            "0 14px 40px rgba(0,0,0,0.45), 0 0 26px color-mix(in srgb, var(--acc) 14%, transparent)",
        }}
      >
        <span className="scanline scanline-m" aria-hidden="true" />

        <div className="r1-m flex items-center justify-between gap-3">
          <span
            className="font-tech"
            style={{
              fontSize: "10px",
              letterSpacing: "0.26em",
              color: "var(--acc)",
            }}
          >
            {meta.name} TRACK
          </span>
          <span
            className="font-tech"
            style={{
              fontSize: "10px",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {pos} / {total}
          </span>
        </div>

        <h3
          className="font-tech r2-m"
          style={{
            margin: "8px 0 0",
            fontSize: "22px",
            lineHeight: 1.2,
            fontWeight: 900,
            letterSpacing: "0.04em",
          }}
        >
          {current.name}
        </h3>

        {current.desc ? (
          <p
            className="r3-m"
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {current.desc}
          </p>
        ) : (
          <p
            className="r3-m"
            style={{
              margin: "8px 0 0",
              padding: "8px 10px",
              border: "1px dashed rgba(255,255,255,0.28)",
              borderRadius: "10px",
              fontSize: "13px",
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {PLACEHOLDER}
          </p>
        )}

        <div
          className="r4-m flex items-center gap-2"
          style={{ marginTop: "14px" }}
        >
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
          <a className="cta-m" href="/register" style={{ flex: 1 }}>
            REGISTER <ArrowRight size={13} />
          </a>
        </div>
      </article>
    </div>
  );
}
