import { z } from "zod";

import {
  COLLEGE_MAX_LENGTH,
  PARTICIPANT_NAME_MAX_LENGTH,
  TEAM_CATEGORIES,
  TEAM_NAME_MAX_LENGTH,
  UNSTOP_TEAM_ID_PATTERN,
} from "../config/constants";
import type { TeamCategory } from "../config/constants";
import {
  TEAM_SHEET_CATEGORY_VALUES,
  UNSTOP_FLAG_CATEGORIES,
  UNSTOP_FLAG_FALSE_VALUES,
  UNSTOP_FLAG_FIELDS,
  UNSTOP_FLAG_TRUE_VALUES,
  UNSTOP_ROLE_VALUES,
} from "../config/unstop";
import type { UnstopFlagField } from "../config/unstop";
import { emailSchema } from "./participant.schema";

const unstopTeamIdSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(UNSTOP_TEAM_ID_PATTERN, "must look like U1A2B3C4");

const trueValues: readonly string[] = UNSTOP_FLAG_TRUE_VALUES;
const falseValues: readonly string[] = UNSTOP_FLAG_FALSE_VALUES;

const acceptedFlagValues = [...trueValues, ...falseValues].join(", ");

const unstopFlagSchema = z
  .string()
  .trim()
  .toLowerCase()
  .transform((value, ctx) => {
    if (trueValues.includes(value)) return true;
    if (falseValues.includes(value)) return false;

    ctx.addIssue({
      code: "custom",
      message: `must be one of ${acceptedFlagValues}`,
    });

    return z.NEVER;
  });

type UnstopFlagInputs = Partial<Record<UnstopFlagField, boolean>>;

const flagCategories = (flags: UnstopFlagInputs): TeamCategory[] | null => {
  if (UNSTOP_FLAG_FIELDS.every((field) => flags[field] === undefined)) {
    return null;
  }

  return TEAM_CATEGORIES.filter((category) =>
    UNSTOP_FLAG_FIELDS.some(
      (field) =>
        UNSTOP_FLAG_CATEGORIES[field] === category && flags[field] === true,
    ),
  );
};

export const unstopRowSchema = z
  .object({
    teamId: unstopTeamIdSchema,
    teamName: z.string().trim().min(1).max(TEAM_NAME_MAX_LENGTH),
    name: z.string().trim().min(1).max(PARTICIPANT_NAME_MAX_LENGTH),
    email: emailSchema,
    phone: z.string().trim().default(""),
    college: z.string().trim().max(COLLEGE_MAX_LENGTH).default(""),
    role: z
      .string()
      .trim()
      .toLowerCase()
      .transform((value) => UNSTOP_ROLE_VALUES[value])
      .refine(
        (value): value is "LEADER" | "MEMBER" => value !== undefined,
        "must say Team Leader or Team Member",
      ),
    fresherFlag: unstopFlagSchema.optional(),
    wieFlag: unstopFlagSchema.optional(),
    ieeeFlag: unstopFlagSchema.optional(),
  })
  .transform(({ fresherFlag, wieFlag, ieeeFlag, ...row }) => ({
    ...row,
    categories: flagCategories({ fresherFlag, wieFlag, ieeeFlag }),
  }));

export const teamSheetRowSchema = z.object({
  teamId: unstopTeamIdSchema,
  teamName: z.string().trim().max(TEAM_NAME_MAX_LENGTH).default(""),
  categories: z
    .string()
    .trim()
    .transform((value) =>
      value
        .split(";")
        .map((part) => part.trim().toLowerCase())
        .filter((part) => part.length > 0),
    )
    .transform((parts, ctx) => {
      const mapped: ("WOMEN" | "FRESHERS" | "IEEE")[] = [];

      for (const part of parts) {
        const category = TEAM_SHEET_CATEGORY_VALUES[part];
        if (!category) {
          ctx.addIssue({
            code: "custom",
            message: `unknown category "${part}"`,
          });
          continue;
        }
        if (!mapped.includes(category)) mapped.push(category);
      }

      return mapped;
    }),
});

export type UnstopRow = z.infer<typeof unstopRowSchema>;
export type TeamSheetRow = z.infer<typeof teamSheetRowSchema>;
