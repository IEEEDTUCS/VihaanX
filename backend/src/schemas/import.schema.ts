import { z } from "zod";

import {
  COLLEGE_MAX_LENGTH,
  PARTICIPANT_NAME_MAX_LENGTH,
  TEAM_NAME_MAX_LENGTH,
  UNSTOP_TEAM_ID_PATTERN,
} from "../config/constants";
import {
  TEAM_SHEET_CATEGORY_VALUES,
  UNSTOP_ROLE_VALUES,
} from "../config/unstop";
import { emailSchema } from "./participant.schema";

const unstopTeamIdSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(UNSTOP_TEAM_ID_PATTERN, "must look like U1A2B3C4");

export const unstopRowSchema = z.object({
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
});

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
