import { z } from "zod";

import { CARD_CODE_PATTERN, CARD_CODE_LENGTH } from "../config/constants";
import { objectIdSchema } from "./admin.schema";
import { rsvpCodeSchema } from "./participant.schema";

export const cardCodeSchema = z
  .string()
  .trim()
  .regex(
    CARD_CODE_PATTERN,
    `must be the ${CARD_CODE_LENGTH} digits printed on the card`,
  );

export const cardCodeParams = z
  .object({
    code: cardCodeSchema,
  })
  .strict();

export const linkCardBody = z
  .object({
    rsvpCode: rsvpCodeSchema,
  })
  .strict();

export const participantIdParams = z
  .object({
    id: objectIdSchema,
  })
  .strict();

export const participantMealParams = z
  .object({
    id: objectIdSchema,
    mealId: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^[a-z0-9-]{1,32}$/,
        "mealId may contain only letters, digits and hyphens",
      ),
  })
  .strict();

export type CardCodeParams = z.infer<typeof cardCodeParams>;
export type LinkCardBody = z.infer<typeof linkCardBody>;
export type ParticipantIdParams = z.infer<typeof participantIdParams>;
export type ParticipantMealParams = z.infer<typeof participantMealParams>;
