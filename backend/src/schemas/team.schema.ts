import { z } from "zod";

import {
  PANEL_MAX_LENGTH,
  POINTS_DECIMALS,
  POINTS_MAX,
  POINTS_MIN,
  REVIEW_NOTE_MAX_LENGTH,
  CHECKPOINT_REVIEW_STATUSES,
  STARS_MAX,
  STARS_MIN,
  TEAM_CATEGORIES,
  TEAM_STATUS_FILTERS,
  TEAM_WORLDS,
} from "../config/constants";
import { ALL_TRACK_IDS } from "../config/tracks";
import { objectIdSchema } from "./admin.schema";
import { optionalQuery, pageQuery, searchQuery } from "./common.schema";
import { checkpointRoundField } from "./submission.schema";

export const TEAM_SORTS = ["name", "points", "stars"] as const;

export const TEAM_SORT_ORDERS: Record<
  (typeof TEAM_SORTS)[number],
  Record<string, 1 | -1>
> = {
  name: { name: 1, _id: 1 },
  points: { points: -1, name: 1, _id: 1 },
  stars: { stars: -1, name: 1, _id: 1 },
};

const teamFilters = {
  search: optionalQuery(searchQuery),
  world: optionalQuery(z.enum(TEAM_WORLDS)),
  category: optionalQuery(z.enum(TEAM_CATEGORIES)),
  track: optionalQuery(z.enum(ALL_TRACK_IDS)),
  status: optionalQuery(z.enum(TEAM_STATUS_FILTERS)),
  sort: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(TEAM_SORTS).default("name"),
  ),
};

export const listTeamsQuery = z
  .object({ ...teamFilters, page: pageQuery })
  .strict();

export const exportTeamsQuery = z.object(teamFilters).strict();

const POINTS_SCALE = 10 ** POINTS_DECIMALS;

const pointsField = z
  .number()
  .min(POINTS_MIN)
  .max(POINTS_MAX)
  .refine(
    (value) =>
      Math.abs(value * POINTS_SCALE - Math.round(value * POINTS_SCALE)) < 1e-9,
    `points may have at most ${POINTS_DECIMALS} decimals`,
  )
  .transform((value) => Math.round(value * POINTS_SCALE) / POINTS_SCALE);

const panelField = z.string().trim().min(1).max(PANEL_MAX_LENGTH).nullable();

const starsField = z.number().int().min(STARS_MIN).max(STARS_MAX);

const categoriesField = z
  .array(z.enum(TEAM_CATEGORIES))
  .max(TEAM_CATEGORIES.length)
  .refine((values) => new Set(values).size === values.length, {
    error: "categories must not repeat",
  });

export const updateTeamBody = z
  .object({
    panel: panelField.optional(),
    points: pointsField.optional(),
    stars: starsField.optional(),
    world: z.enum(TEAM_WORLDS).optional(),
    categories: categoriesField.optional(),
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    error: "pass at least one field to change",
  });

export const reviewBody = z
  .object({
    status: z.enum(CHECKPOINT_REVIEW_STATUSES).nullable(),
    note: z.string().trim().min(1).max(REVIEW_NOTE_MAX_LENGTH).optional(),
  })
  .strict()
  .refine((body) => body.status !== null || body.note === undefined, {
    error: "note is only allowed together with a status",
  });

export const setBedsheetsBody = z
  .object({
    count: z.number().int().min(0),
  })
  .strict();

export const teamIdParams = z
  .object({
    id: objectIdSchema,
  })
  .strict();

export const teamRoundParams = z
  .object({
    id: objectIdSchema,
    round: checkpointRoundField,
  })
  .strict();

export type ListTeamsQuery = z.infer<typeof listTeamsQuery>;
export type ExportTeamsQuery = z.infer<typeof exportTeamsQuery>;
export type UpdateTeamBody = z.infer<typeof updateTeamBody>;
export type ReviewBody = z.infer<typeof reviewBody>;
export type SetBedsheetsBody = z.infer<typeof setBedsheetsBody>;
export type TeamIdParams = z.infer<typeof teamIdParams>;
export type TeamRoundParams = z.infer<typeof teamRoundParams>;
