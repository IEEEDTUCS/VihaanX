"use client";

export default function WorldPlanet({ world, scale = "lg", aura = false }) {
  const sm = scale === "sm";
  const bob = sm ? "bob-m" : "bob-d";
  const bands = sm ? "bands bands-m" : "bands bands-d";
  const ringWidth = sm ? "1.5px" : "2px";
  const spread = sm ? [4, 9] : [7, 15];

  if (world === "hardware") {
    return (
      <>
        {aura && (
          <span
            className="aura-d"
            style={{
              position: "absolute",
              inset: "-18%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(56,189,248,0.32) 0%, rgba(56,189,248,0.08) 45%, transparent 68%)",
              filter: "blur(14px)",
              animationDelay: "2s",
            }}
          />
        )}
        <span
          className={bob}
          style={{
            position: "absolute",
            inset: 0,
            animationDelay: sm ? undefined : "3s",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              overflow: "hidden",
              background:
                "radial-gradient(circle at 26% 40%, rgba(3,30,55,0.35) 0 5%, transparent 5.5%)," +
                "radial-gradient(circle at 56% 62%, rgba(3,30,55,0.35) 0 9%, transparent 9.5%)," +
                "radial-gradient(circle at 46% 20%, rgba(3,30,55,0.3) 0 4%, transparent 4.5%)," +
                "radial-gradient(circle at 70% 34%, rgba(3,30,55,0.3) 0 6%, transparent 6.5%)," +
                "radial-gradient(circle at 34% 74%, rgba(3,30,55,0.3) 0 7%, transparent 7.5%)," +
                "radial-gradient(circle at 34% 30%, #e2f8ff 0%, #8bd9f8 16%, #38bdf8 38%, #1679b3 62%, #083452 84%, #031421 100%)",
              boxShadow: `0 0 ${sm ? 36 : 60}px rgba(56,189,248,0.45)`,
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 28%, transparent 40%, rgba(4,5,18,0.8) 90%)",
              }}
            />
          </span>
        </span>
      </>
    );
  }

  const ring = (front) => (
    <span
      style={{
        position: "absolute",
        left: "-36%",
        top: "38%",
        width: "172%",
        height: "26%",
        borderRadius: "50%",
        border: `${ringWidth} solid ${front ? "rgba(255,170,200,0.75)" : "rgba(255,150,185,0.5)"}`,
        boxShadow: front
          ? `0 0 0 ${spread[0]}px rgba(255,59,108,0.16), 0 0 0 ${spread[1]}px rgba(255,59,108,0.07)`
          : `0 0 0 ${spread[0]}px rgba(255,59,108,0.12), 0 0 0 ${spread[1]}px rgba(255,59,108,0.06)`,
        transform: "rotate(-14deg)",
        clipPath: front ? "inset(50% -20% -40% -20%)" : undefined,
      }}
    />
  );

  return (
    <>
      {aura && (
        <span
          className="aura-d"
          style={{
            position: "absolute",
            inset: "-16%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,59,108,0.3) 0%, rgba(255,59,108,0.08) 45%, transparent 68%)",
            filter: "blur(16px)",
          }}
        />
      )}
      <span className={bob} style={{ position: "absolute", inset: 0 }}>
        {ring(false)}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 34% 28%, #ffd0dc 0%, #ff8aa9 14%, #ff3b6c 36%, #b81d55 60%, #5a0b2c 82%, #22040f 100%)",
            boxShadow: `0 0 ${sm ? 40 : 70}px rgba(255,59,108,0.45)`,
          }}
        >
          <span
            className={bands}
            style={{
              background: sm
                ? "repeating-linear-gradient(172deg, rgba(255,255,255,0.08) 0 5px, transparent 5px 12px, rgba(110,8,45,0.22) 12px 16px, transparent 16px 24px)"
                : "repeating-linear-gradient(172deg, rgba(255,255,255,0.08) 0 12px, transparent 12px 30px, rgba(110,8,45,0.22) 30px 40px, transparent 40px 62px)",
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 26%, transparent 38%, rgba(4,5,18,0.78) 88%)",
            }}
          />
        </span>
        {ring(true)}
      </span>
    </>
  );
}

/** Flat gradient used for the mobile mini globe in the corner of the stage. */
export const MINI_GLOBE_BG = {
  hardware:
    "radial-gradient(circle at 56% 62%, rgba(3,30,55,0.35) 0 9%, transparent 9.5%)," +
    "radial-gradient(circle at 30% 38%, rgba(3,30,55,0.35) 0 7%, transparent 7.5%)," +
    "radial-gradient(circle at 34% 30%, #e2f8ff 0%, #8bd9f8 16%, #38bdf8 38%, #1679b3 62%, #083452 84%, #031421 100%)",
  software:
    "repeating-linear-gradient(172deg, rgba(255,255,255,0.1) 0 3px, transparent 3px 7px)," +
    "radial-gradient(circle at 34% 28%, #ffd0dc 0%, #ff8aa9 14%, #ff3b6c 36%, #b81d55 60%, #5a0b2c 82%, #22040f 100%)",
};
