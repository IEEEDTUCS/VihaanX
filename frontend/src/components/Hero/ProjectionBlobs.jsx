"use client";

const projections = [
  {
    className: "projection--north",
    eyebrow: "EVENT FEATURE / BUILD",
    title: "BUILD YOUR OWN BRIEF",
    copy: "Choose a track, then solve any real-world problem that matters to you.",
    accent: "pink",
  },
  {
    className: "projection--east",
    eyebrow: "EVENT FEATURE / MENTORSHIP",
    title: "INDUSTRY MENTORS",
    copy: "Learn from industry mentors connected to Microsoft, NXP Semiconductors, Samsung and more.",
    accent: "cyan",
  },
  {
    className: "projection--west",
    eyebrow: "EVENT FEATURE / JUDGING",
    title: "THE EXPERT JURY",
    copy: "Pitch to CXOs, VPs and executive leaders from premier technology companies.",
    accent: "cyan",
  },
  {
    className: "projection--south",
    eyebrow: "EVENT FEATURE / REWARDS",
    title: "PRIZES AND PERKS",
    copy: "Compete for exciting cash prizes, cloud credits and benefits designed for every participant.",
    accent: "pink",
  },
];

function Drone({ accent }) {
  return (
    <span className={`projection-drone projection-drone--${accent}`} aria-hidden="true">
      <span className="drone-rotor drone-rotor--left" />
      <span className="drone-rotor drone-rotor--right" />
      <span className="drone-body" />
      <span className="drone-beam" />
    </span>
  );
}

export default function ProjectionBlobs() {
  return (
    <div className="projection-field" aria-hidden="true">
      {projections.map((projection) => (
        <div
          className={`projection-wrap ${projection.className}`}
          key={projection.title}
        >
          <Drone accent={projection.accent} />
          <div className={`projection-card projection-card--${projection.accent}`}>
            <span className="projection-corner projection-corner--top" />
            <span className="projection-corner projection-corner--bottom" />
            <p className="projection-eyebrow">{projection.eyebrow}</p>
            <p className="projection-title">{projection.title}</p>
            <p className="projection-copy">{projection.copy}</p>
            <span className="projection-status">AVAILABLE TO PARTICIPANTS <i /></span>
          </div>
        </div>
      ))}
    </div>
  );
}
