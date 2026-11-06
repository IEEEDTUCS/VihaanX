import { Schema, Types, model } from "mongoose";

import {
  CHECKPOINT_AUTO_STATUSES,
  CHECKPOINT_REVIEW_STATUSES,
  TEAM_CATEGORIES,
  TEAM_DESCRIPTION_MAX_LENGTH,
  TEAM_NAME_MAX_LENGTH,
  TEAM_WORLDS,
  UNSTOP_TEAM_ID_PATTERN,
} from "../config/constants";
import type {
  CheckpointAutoStatus,
  CheckpointReviewStatus,
  TeamCategory,
  TeamWorld,
} from "../config/constants";

export type Checkpoint = {
  round: number;
  url: string;
  commitSha: string | null;
  submittedAt: Date;
  autoStatus: CheckpointAutoStatus;
  autoFlags: string[];
  reviewStatus: CheckpointReviewStatus | null;
  reviewNote: string | null;
  reviewedBy: Types.ObjectId | null;
};

export type Team = {
  unstopId: string;
  name: string;
  world: TeamWorld;
  categories: TeamCategory[];
  tracks: string[];
  description: string;
  repoUrl: string | null;
  imageUrl: string | null;
  projectAutoStatus: CheckpointAutoStatus | null;
  projectAutoFlags: string[];
  room: string | null;
  panel: string | null;
  points: number;
  stars: number;
  checkpoints: Checkpoint[];
  createdAt: Date;
};

const checkpointSchema = new Schema<Checkpoint>(
  {
    round: { type: Number, required: true, min: 1 },
    url: { type: String, required: true },
    commitSha: { type: String, default: null },
    submittedAt: { type: Date, required: true },
    autoStatus: {
      type: String,
      required: true,
      enum: CHECKPOINT_AUTO_STATUSES,
    },
    autoFlags: { type: [String], default: [] },
    reviewStatus: {
      type: String,
      default: null,
      enum: [...CHECKPOINT_REVIEW_STATUSES, null],
    },
    reviewNote: { type: String, default: null },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { _id: false },
);

const hasNoDuplicates = (values: string[]) =>
  new Set(values).size === values.length;

const teamSchema = new Schema<Team>(
  {
    unstopId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: UNSTOP_TEAM_ID_PATTERN,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: TEAM_NAME_MAX_LENGTH,
    },
    world: {
      type: String,
      required: true,
      enum: TEAM_WORLDS,
    },
    categories: {
      type: [String],
      default: [],
      enum: TEAM_CATEGORIES,
      validate: {
        validator: hasNoDuplicates,
        message: "categories must not repeat",
      },
    },
    tracks: {
      type: [String],
      default: [],
      validate: {
        validator: hasNoDuplicates,
        message: "tracks must not repeat",
      },
    },
    description: {
      type: String,
      default: "",
      maxlength: TEAM_DESCRIPTION_MAX_LENGTH,
    },
    repoUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    projectAutoStatus: {
      type: String,
      default: null,
      enum: [...CHECKPOINT_AUTO_STATUSES, null],
    },
    projectAutoFlags: { type: [String], default: [] },
    room: { type: String, default: null },
    panel: { type: String, default: null },
    points: { type: Number, default: 0, min: 0 },
    stars: { type: Number, default: 0, min: 0, max: 5 },
    checkpoints: { type: [checkpointSchema], default: [] },
  },
  {
    collection: "teams",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

teamSchema.index({ world: 1, points: -1 });

export const TeamModel = model<Team>("Team", teamSchema);
