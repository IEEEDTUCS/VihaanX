import { z } from "zod";

import {
  JUDGING_ROUND_TYPES,
  JUDGING_SCORE_MAX,
  JUDGING_STARS_MAX,
} from "../config/constants";

export const judgingRoundQuery = z
  .object({
    roundId: z.string().trim().min(1).max(100),
    roundType: z.enum(JUDGING_ROUND_TYPES),
  })
  .strict();

export type JudgingRoundQuery = z.infer<typeof judgingRoundQuery>;

export const judgingRoundParams = z
  .object({ roundId: z.string().trim().min(1).max(100) })
  .strict();

export const judgingRoundTypeQuery = z
  .object({ roundType: z.enum(JUDGING_ROUND_TYPES) })
  .strict();

export type JudgingRoundParams = z.infer<typeof judgingRoundParams>;
export type JudgingRoundTypeQuery = z.infer<typeof judgingRoundTypeQuery>;

export const scoreRowSchema = z.object({
  roundType: z.enum(JUDGING_ROUND_TYPES),
  panelNumber: z.string().trim().min(1).max(50),
  evaluatorNumber: z.string().trim().min(1).max(50),
  teamId: z.string().trim().min(1).max(100),
  totalScore: z.number().int().min(0).max(JUDGING_SCORE_MAX),
  stars: z.number().int().min(0).max(JUDGING_STARS_MAX),
});

export type ScoreRow = z.infer<typeof scoreRowSchema>;
