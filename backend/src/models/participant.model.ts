import { Schema, Types, model } from "mongoose";

import {
  COLLEGE_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PARTICIPANT_NAME_MAX_LENGTH,
  PARTICIPANT_ROLES,
  QR_CODE_MAX_LENGTH,
} from "../config/constants";
import type { ParticipantRole } from "../config/constants";

export type Participant = {
  teamId: Types.ObjectId;
  name: string;
  email: string;
  college: string;
  role: ParticipantRole;
  phone: string | null;
  rsvpCode: string;
  qrCode: string | null;
  checkedIn: boolean;
  checkedInAt: Date | null;
  mealsTaken: string[];
  bedsheetIssued: boolean;
  refreshTokenHash: string | null;
  tokenVersion: number;
  createdAt: Date;
};

const participantSchema = new Schema<Participant>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: PARTICIPANT_NAME_MAX_LENGTH,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: EMAIL_MAX_LENGTH,
    },
    college: {
      type: String,
      default: "",
      trim: true,
      maxlength: COLLEGE_MAX_LENGTH,
    },
    role: {
      type: String,
      required: true,
      enum: PARTICIPANT_ROLES,
    },
    phone: {
      type: String,
      default: null,
      select: false,
    },
    rsvpCode: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    qrCode: {
      type: String,
      default: null,
      maxlength: QR_CODE_MAX_LENGTH,
      select: false,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    mealsTaken: {
      type: [String],
      default: [],
    },
    bedsheetIssued: {
      type: Boolean,
      default: false,
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    collection: "participants",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

participantSchema.index(
  { qrCode: 1 },
  { unique: true, partialFilterExpression: { qrCode: { $type: "string" } } },
);

participantSchema.index({ teamId: 1 });

participantSchema.index(
  { teamId: 1 },
  {
    name: "teamId_1_leader",
    unique: true,
    partialFilterExpression: { role: "LEADER" },
  },
);

export const ParticipantModel = model<Participant>(
  "Participant",
  participantSchema,
);
