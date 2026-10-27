"use client";

import { useCallback, useMemo, useState } from "react";
import { OTHER_WORLD, TRACKS, WORLDS } from "@/data/tracks";

const RAD = Math.PI / 180;
const pad2 = (n) => String(n).padStart(2, "0");

export default function useTrackVoyage() {
  const [world, setWorld] = useState("software");
  const [selected, setSelected] = useState(TRACKS.software[0].id);
  // increments on every world change; drives the comet and the node pop-in delays
  const [travelTick, setTravelTick] = useState(0);

  const selectTrack = useCallback(
    (nextWorld, id) => {
      if (nextWorld !== world) setTravelTick((t) => t + 1);
      setWorld(nextWorld);
      setSelected(id);
    },
    [world],
  );

  // Picking a world resets the selection to that world's first track (§3).
  const selectWorld = useCallback(
    (nextWorld) => selectTrack(nextWorld, TRACKS[nextWorld][0].id),
    [selectTrack],
  );

  const openInnovation = useCallback(
    (nextWorld) => {
      const oi = TRACKS[nextWorld].find((t) => t.name === "Open Innovation");
      if (oi) selectTrack(nextWorld, oi.id);
    },
    [selectTrack],
  );

  const otherKey = OTHER_WORLD[world];
  const list = TRACKS[world];
  const meta = WORLDS[world];
  const otherMeta = WORLDS[otherKey];

  const foundIdx = list.findIndex((t) => t.id === selected);
  const idx = foundIdx === -1 ? 0 : foundIdx;
  const current = list[idx];

  const prev = useCallback(
    () => selectTrack(world, list[(idx - 1 + list.length) % list.length].id),
    [selectTrack, world, list, idx],
  );
  const next = useCallback(
    () => selectTrack(world, list[(idx + 1) % list.length].id),
    [selectTrack, world, list, idx],
  );

  const rings = useMemo(() => {
    const place = (arr, startDeg, ring, offset) =>
      arr.map((track, i) => {
        const a = (startDeg + (i * 360) / arr.length) * RAD;
        return {
          track,
          i,
          ring,
          num: offset + i + 1, // position within the world, shown as "TRACK n"
          x: (50 + 50 * Math.cos(a)).toFixed(3),
          y: (50 + 50 * Math.sin(a)).toFixed(3),
        };
      });
    return {
      inner: place(list.slice(0, meta.innerCount), -90, 0, 0),
      outer: place(list.slice(meta.innerCount), -54, 1, meta.innerCount),
    };
  }, [list, meta.innerCount]);

  return {
    // state
    world,
    selected,
    travelTick,
    // data
    list,
    meta,
    otherMeta,
    current,
    rings,
    // derived labels
    idx,
    num: idx + 1, // "TRACK 1" label
    pos: pad2(idx + 1),
    total: pad2(list.length),
    countLabel: pad2(list.length),
    isSoftware: world === "software",
    acc: meta.acc,
    otherAcc: otherMeta.acc,
    // actions
    selectWorld,
    selectTrack,
    openInnovation,
    prev,
    next,
  };
}
