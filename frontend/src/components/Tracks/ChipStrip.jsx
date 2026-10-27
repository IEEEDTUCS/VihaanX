"use client";

export default function ChipStrip({ world, list, selected, selectTrack }) {
  return (
    <div className="strip" role="group" aria-label="All tracks in this world">
      {list.map((track) => {
        const on = track.id === selected;
        return (
          <button
            key={track.id}
            type="button"
            className={on ? "chip on" : "chip"}
            onClick={() => selectTrack(world, track.id)}
            aria-pressed={on}
          >
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              {track.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
