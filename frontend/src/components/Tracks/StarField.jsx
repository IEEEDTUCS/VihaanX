"use client";

const star = (i) => {
  const r = (n) =>
    (((Math.sin((i + 1) * 12.9898 * n) * 43758.5453) % 1) + 1) % 1;
  return {
    x: (r(1) * 100).toFixed(2),
    y: (r(2) * 100).toFixed(2),
    s: (r(3) * 2 + 1).toFixed(1),
    d: (r(4) * 4).toFixed(2),
    t: (3 + r(5) * 4).toFixed(2),
  };
};

export default function StarField({ count = 50 }) {
  const stars = Array.from({ length: count }, (_, i) => star(i));

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stars.map((st, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: `${st.s}px`,
            height: `${st.s}px`,
            animationDelay: `${st.d}s`,
            animationDuration: `${st.t}s`,
          }}
        />
      ))}
      <span className="shoot" style={{ left: "84%", top: "5%" }} />
      <span
        className="shoot"
        style={{ left: "52%", top: "1%", animationDelay: "5.5s" }}
      />
    </div>
  );
}
