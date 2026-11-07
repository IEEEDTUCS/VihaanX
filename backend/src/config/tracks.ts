// Mirror of ../frontend/src/data/tracks.js - keep the ids and names in sync
// with the frontend when either side changes.

import { TEAM_WORLDS } from "./constants";
import type { TeamWorld } from "./constants";

export type Track = {
  id: string;
  name: string;
};

export const TRACKS: Record<TeamWorld, readonly Track[]> = {
  SOFTWARE: [
    { id: "s1", name: "HealthTech" },
    { id: "s2", name: "FinTech" },
    { id: "s3", name: "Education" },
    { id: "s4", name: "Web3 & Blockchain" },
    { id: "s5", name: "E-Sports" },
    { id: "s6", name: "Women's Safety" },
    { id: "s7", name: "Security" },
    { id: "s8", name: "Sustainability" },
    { id: "s9", name: "Open Innovation" },
  ],
  HARDWARE: [
    { id: "h1", name: "IoT" },
    { id: "h2", name: "AgriTech" },
    { id: "h3", name: "Smart City & Civic Tech" },
    { id: "h4", name: "Sustainability" },
    { id: "h5", name: "Open Innovation" },
  ],
} as const;

type TrackWithWorld = Track & { world: TeamWorld };

const TRACKS_BY_ID = new Map<string, TrackWithWorld>(
  TEAM_WORLDS.flatMap((world) =>
    TRACKS[world].map(
      (track) => [track.id, { ...track, world }] as [string, TrackWithWorld],
    ),
  ),
);

export const ALL_TRACK_IDS = [...TRACKS_BY_ID.keys()] as [string, ...string[]];

export const isTrackOfWorld = (id: string, world: TeamWorld) =>
  TRACKS_BY_ID.get(id)?.world === world;

export const trackName = (id: string) => TRACKS_BY_ID.get(id)?.name ?? null;

export const toPublicTracks = (ids: string[]) =>
  ids.map((id) => ({ id, name: trackName(id) }));
