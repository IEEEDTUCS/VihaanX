import { z } from "zod";

import { MAX_PAGE, SEARCH_MAX_LENGTH } from "../config/constants";

const blankToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const optionalQuery = <T extends z.ZodType>(schema: T) =>
  z.preprocess(blankToUndefined, schema.optional());

export const pageQuery = z.preprocess(
  blankToUndefined,
  z.coerce.number().int().min(1).max(MAX_PAGE).default(1),
);

export const searchQuery = z.string().trim().max(SEARCH_MAX_LENGTH);

export const booleanQuery = z
  .enum(["true", "false"])
  .transform((value) => value === "true");
