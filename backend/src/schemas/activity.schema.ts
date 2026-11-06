import { z } from "zod";

import { ACTIVITY_ACTIONS } from "../config/constants";
import { objectIdSchema } from "./admin.schema";
import { optionalQuery, pageQuery } from "./common.schema";

export const listActivityQuery = z
  .object({
    team: optionalQuery(objectIdSchema),
    participant: optionalQuery(objectIdSchema),
    actor: optionalQuery(objectIdSchema),
    action: optionalQuery(z.enum(ACTIVITY_ACTIONS)),
    page: pageQuery,
  })
  .strict();

export type ListActivityQuery = z.infer<typeof listActivityQuery>;
