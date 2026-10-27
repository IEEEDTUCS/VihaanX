"use client";

import { useEffect, useRef, useState } from "react";

import StarField from "@/components/Tracks/StarField";
import TracksDesktop from "@/components/Tracks/TracksDesktop";
import TracksMobile from "@/components/Tracks/TracksMobile";
import useTrackVoyage from "@/components/Tracks/useTrackVoyage";

/**
 * Hackathon tracks — the approved "Voyage" design.
 * Spec: docs/references/tracks/README.md · styles: app/tracks.css (scoped under .vxt)
 *
 * Three tiers, two subtrees driven by one state hook so world, selection and travel stay in sync:
 *   <md (<768)      the compact mobile column
 *   md-lg (768-1023) the desktop components, stacked, orbit map at 0.8
 *   lg+ (1024+)      the desktop composition, map beside the panel
 */
export default function TracksSection() {
  const voyage = useTrackVoyage();
  const sectionRef = useRef(null);
  // The orbit keeps ~70 looping animations alive. There is no point ticking them while the
  // section is off screen behind the hero, so pause them until it comes into view. Pausing is
  // not restarting: rings resume mid-rotation, and the one-shot entry animations are excluded
  // (see .vxt-idle in app/tracks.css), so nothing about the section's appearance changes.
  //
  // No rootMargin: the page is only ~3100px tall and this section is 1286px of it, so any
  // margin at all means it is never considered off screen and the pause never fires.
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setIdle(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tracks"
      aria-label="Hackathon tracks"
      className={`${idle ? "vxt-idle " : ""}vxt relative w-full overflow-hidden bg-gradient-to-b from-[#070b19] via-[#080d21] to-[#070b19] px-4 pt-14 pb-12 text-white md:px-6 md:pt-20 md:pb-20 xl:pt-28 xl:pb-30`}
      style={{ "--acc": voyage.acc }}
    >
      <StarField count={50} />

      <div className="md:hidden">
        <TracksMobile {...voyage} />
      </div>

      <div className="hidden md:block">
        <TracksDesktop {...voyage} />
      </div>
    </section>
  );
}
