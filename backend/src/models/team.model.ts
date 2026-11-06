import { Schema, Types, model } from "mongoose";

import {
  CHECKPOINT_AUTO_STATUSES,
  CHECKPOINT_REVIEW_STATUSES,
  CHECKPOINT_ROUNDS,
  PROJECT_TRACKS_MAX,
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

export type SubmissionReview = {
  reviewStatus: CheckpointReviewStatus | null;
  reviewNote: string | null;
  reviewedBy: Types.ObjectId | null;
};

export type SubmissionResult = {
  autoStatus: CheckpointAutoStatus;
  autoFlags: string[];
  autoNotes: string[];
};

export type Project = SubmissionResult &
  SubmissionReview & {
    tracks: string[];
    description: string;
    repoUrl: string | null;
    imageUrl: string | null;
    submittedAt: Date | null;
  };

export type Checkpoint = SubmissionResult &
  SubmissionReview & {
    round: number;
    url: string | null;
    commitSha: string | null;
    submittedAt: Date | null;
  };

export type Team = {
  unstopId: string;
  name: string;
  world: TeamWorld;
  categories: TeamCategory[];
  project: Project;
  room: string | null;
  bedsheetsIssued: number;
  panel: string | null;
  points: number;
  stars: number;
  checkpoints: Checkpoint[];
  createdAt: Date;
};

const hasNoDuplicates = (values: string[]) =>
  new Set(values).size === values.length;

const resultFields = {
  autoStatus: {
    type: String,
    required: true,
    enum: [...CHECKPOINT_AUTO_STATUSES],
    default: "NOT_SUBMITTED" as CheckpointAutoStatus,
  },
  autoFlags: { type: [String], default: [] as string[] },
  autoNotes: { type: [String], default: [] as string[] },
};

const reviewFields = {
  reviewStatus: {
    type: String,
    default: null,
    enum: [...CHECKPOINT_REVIEW_STATUSES, null],
  },
  reviewNote: { type: String, default: null },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
};

const projectSchema = new Schema<Project>(
  {
    tracks: {
      type: [String],
      default: [] as string[],
      validate: [
        {
          validator: hasNoDuplicates,
          message: "tracks must not repeat",
        },
        {
          validator: (values: string[]) => values.length <= PROJECT_TRACKS_MAX,
          message: `a team can pick at most ${PROJECT_TRACKS_MAX} tracks`,
        },
      ],
    },
    description: {
      type: String,
      default: "",
      maxlength: TEAM_DESCRIPTION_MAX_LENGTH,
    },
    repoUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    submittedAt: { type: Date, default: null },
    ...resultFields,
    ...reviewFields,
  },
  { _id: false },
);

const checkpointSchema = new Schema<Checkpoint>(
  {
    round: { type: Number, required: true, min: 1 },
    url: { type: String, default: null },
    commitSha: { type: String, default: null },
    submittedAt: { type: Date, default: null },
    ...resultFields,
    ...reviewFields,
  },
  { _id: false },
);

const emptyCheckpoints = (): Checkpoint[] =>
  CHECKPOINT_ROUNDS.map((round) => ({
    round,
    url: null,
    commitSha: null,
    submittedAt: null,
    autoStatus: "NOT_SUBMITTED",
    autoFlags: [],
    autoNotes: [],
    reviewStatus: null,
    reviewNote: null,
    reviewedBy: null,
  }));

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
    project: {
      type: projectSchema,
      default: () => ({}),
    },
    room: { type: String, default: null },
    bedsheetsIssued: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "bedsheetsIssued must be a whole number",
      },
    },
    panel: { type: String, default: null },
    points: { type: Number, default: 0, min: 0 },
    stars: { type: Number, default: 0, min: 0, max: 5 },
    checkpoints: { type: [checkpointSchema], default: emptyCheckpoints },
  },
  {
    collection: "teams",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

teamSchema.index({ world: 1, points: -1 });

export const TeamModel = model<Team>("Team", teamSchema);
