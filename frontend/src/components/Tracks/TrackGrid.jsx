"use client";

import TRACK_ICONS from "./trackIcons";

export default function TrackGrid({ world, list, selected, selectTrack }) {
  return (
    // keyed on the world so the staggered rise replays after a travel
    <div className="grid3" key={world}>
      {list.map((track, i) => {
        const on = track.id === selected;
        return (
          <button
            key={track.id}
            type="button"
            className={`card${world === "hardware" ? " hw" : ""}${on ? " on" : ""}`}
            onClick={() => selectTrack(world, track.id)}
            aria-pressed={on}
            style={{ animationDelay: `${40 * (i + 1)}ms` }}
          >
            <span className="port">{TRACK_ICONS[track.icon]}</span>
            <span className="cmeta">
              <span className="cnum">TRACK {i + 1}</span>
              <span className="cname">{track.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
