import { z } from "zod";

import {
  CHECKPOINT_ROUNDS,
  COMMIT_URL_PATTERN,
  PROJECT_TRACKS_MAX,
  PROJECT_TRACKS_MIN,
  REPO_URL_PATTERN,
  TEAM_DESCRIPTION_MAX_LENGTH,
  URL_MAX_LENGTH,
} from "../config/constants";
import type { TeamWorld } from "../config/constants";
import { TRACKS } from "../config/tracks";

const trackIds = (world: TeamWorld) =>
  TRACKS[world].map((track) => track.id) as [string, ...string[]];

const tracksField = (world: TeamWorld) =>
  z.preprocess(
    (value) => (typeof value === "string" ? [value] : value),
    z
      .array(z.enum(trackIds(world)))
      .min(PROJECT_TRACKS_MIN)
      .max(PROJECT_TRACKS_MAX)
      .refine((ids) => new Set(ids).size === ids.length, {
        error: "tracks must not repeat",
      }),
  );

const descriptionField = z
  .string()
  .trim()
  .min(1)
  .max(TEAM_DESCRIPTION_MAX_LENGTH);

const repoUrlField = z
  .string()
  .trim()
  .max(URL_MAX_LENGTH)
  .regex(REPO_URL_PATTERN, "must look like https://github.com/<owner>/<repo>");

const commitUrlField = z
  .string()
  .trim()
  .max(URL_MAX_LENGTH)
  .regex(
    COMMIT_URL_PATTERN,
    "must look like https://github.com/<owner>/<repo>/commit/<sha>",
  );

export const softwareProjectBody = (world: TeamWorld) =>
  z
    .object({
      tracks: tracksField(world),
      description: descriptionField,
      repoUrl: repoUrlField,
    })
    .strict();

export const hardwareProjectBody = (world: TeamWorld) =>
  z
    .object({
      tracks: tracksField(world),
      description: descriptionField,
    })
    .strict();

export const softwareCheckpointBody = z
  .object({
    commitUrl: commitUrlField,
  })
  .strict();

export const hardwareCheckpointBody = z.object({}).strict();

export const checkpointRoundParams = z
  .object({
    round: z.coerce
      .number()
      .int()
      .refine(
        (round): round is (typeof CHECKPOINT_ROUNDS)[number] =>
          CHECKPOINT_ROUNDS.some((valid) => valid === round),
        {
          error: `round must be one of ${CHECKPOINT_ROUNDS.join(", ")}`,
        },
      ),
  })
  .strict();

export type SoftwareProjectBody = z.infer<
  ReturnType<typeof softwareProjectBody>
>;
export type HardwareProjectBody = z.infer<
  ReturnType<typeof hardwareProjectBody>
>;
export type SoftwareCheckpointBody = z.infer<typeof softwareCheckpointBody>;
export type CheckpointRoundParams = z.infer<typeof checkpointRoundParams>;
