import { z } from "zod";

import { TEAM_CATEGORIES, TEAM_WORLDS } from "../config/constants";
import { objectIdSchema } from "./admin.schema";
import { optionalQuery, pageQuery, searchQuery } from "./common.schema";

export const TEAM_SORTS = ["name"] as const;

export const TEAM_SORT_ORDERS: Record<
  (typeof TEAM_SORTS)[number],
  Record<string, 1 | -1>
> = {
  name: { name: 1, _id: 1 },
};

export const listTeamsQuery = z
  .object({
    search: optionalQuery(searchQuery),
    world: optionalQuery(z.enum(TEAM_WORLDS)),
    category: optionalQuery(z.enum(TEAM_CATEGORIES)),
    sort: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.enum(TEAM_SORTS).default("name"),
    ),
    page: pageQuery,
  })
  .strict();

export const teamIdParams = z
  .object({
    id: objectIdSchema,
  })
  .strict();

export type ListTeamsQuery = z.infer<typeof listTeamsQuery>;
export type TeamIdParams = z.infer<typeof teamIdParams>;
