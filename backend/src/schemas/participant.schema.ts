import { z } from "zod";

import {
  EMAIL_MAX_LENGTH,
  PARTICIPANT_ROLES,
  QR_CODE_MAX_LENGTH,
  QR_CODE_MIN_LENGTH,
} from "../config/constants";
import {
  booleanQuery,
  optionalQuery,
  pageQuery,
  searchQuery,
} from "./common.schema";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(EMAIL_MAX_LENGTH)
  .pipe(z.email("must be a valid email address"));

export const qrCodeSchema = z
  .string()
  .trim()
  .regex(
    new RegExp(`^[A-Za-z0-9]{${QR_CODE_MIN_LENGTH},${QR_CODE_MAX_LENGTH}}$`),
    "qrCode may contain only letters and digits",
  );

export const rsvpCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{4,32}$/, "rsvpCode may contain only letters and digits");

export const participantLoginBody = z
  .object({
    email: emailSchema,
    qrCode: qrCodeSchema,
    rsvpCode: rsvpCodeSchema,
  })
  .strict();

const participantFilters = {
  search: optionalQuery(searchQuery),
  present: optionalQuery(booleanQuery),
  role: optionalQuery(z.enum(PARTICIPANT_ROLES)),
};

export const listParticipantsQuery = z
  .object({ ...participantFilters, page: pageQuery })
  .strict();

export const exportParticipantsQuery = z.object(participantFilters).strict();

export type ParticipantLoginBody = z.infer<typeof participantLoginBody>;
export type ListParticipantsQuery = z.infer<typeof listParticipantsQuery>;
export type ExportParticipantsQuery = z.infer<typeof exportParticipantsQuery>;
