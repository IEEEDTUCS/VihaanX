import { Schema, Types, model } from "mongoose";

import {
  JUDGING_REQUIRED_EVALUATORS,
  JUDGING_ROUND_STATUS,
  JUDGING_ROUND_TYPES,
  JUDGING_SCORE_MAX,
  JUDGING_STARS_MAX,
} from "../config/constants";
import type {
  JudgingRoundStatus,
  JudgingRoundType,
} from "../config/constants";

export type JudgingRound = {
  roundId: string;
  roundType: JudgingRoundType;
  status: JudgingRoundStatus;
  requiredEvaluators: number;
  calculationVersion: number;
  calculatedAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JudgeScore = {
  roundId: string;
  roundType: JudgingRoundType;
  panelNumber: string;
  evaluatorNumber: string;
  teamId: Types.ObjectId;
  teamUnstopId: string;
  totalScore: number;
  stars: number;
  importBatchId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type NormalizedJudgeScore = {
  roundId: string;
  roundType: JudgingRoundType;
  panelNumber: string;
  evaluatorNumber: string;
  teamId: Types.ObjectId;
  teamUnstopId: string;
  rawScore: number;
  mean: number;
  standardDeviation: number;
  zScore: number;
  stars: number;
  calculationVersion: number;
  calculatedAt: Date;
};

export type TeamJudgingResult = {
  roundId: string;
  roundType: JudgingRoundType;
  panelNumber: string;
  teamId: Types.ObjectId;
  teamUnstopId: string;
  evaluatorScores: {
    evaluatorNumber: string;
    normalizedScore: number;
    stars: number;
  }[];
  finalNormalizedScore: number;
  totalStars: number;
  rank: number;
  calculationVersion: number;
  calculatedAt: Date;
};

export type JudgingImportBatch = {
  roundId: string;
  roundType: JudgingRoundType;
  filename: string;
  importedBy: Types.ObjectId;
  rowCount: number;
  createdAt: Date;
};

const roundType = {
  type: String,
  required: true,
  enum: JUDGING_ROUND_TYPES,
};

const roundId = { type: String, required: true, trim: true, maxlength: 100 };

const judgingRoundSchema = new Schema<JudgingRound>(
  {
    roundId,
    roundType,
    status: {
      type: String,
      required: true,
      enum: JUDGING_ROUND_STATUS,
      default: "RECEIVING_SCORES",
    },
    requiredEvaluators: {
      type: Number,
      required: true,
      default: JUDGING_REQUIRED_EVALUATORS,
      min: 1,
    },
    calculationVersion: { type: Number, required: true, default: 0, min: 0 },
    calculatedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
  },
  { collection: "judging_rounds", timestamps: true },
);
judgingRoundSchema.index({ roundId: 1 }, { unique: true });

const scoreSchema = new Schema<JudgeScore>(
  {
    roundId,
    roundType,
    panelNumber: { type: String, required: true, trim: true, maxlength: 50 },
    evaluatorNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamUnstopId: { type: String, required: true, trim: true },
    totalScore: { type: Number, required: true, min: 0, max: JUDGING_SCORE_MAX },
    stars: { type: Number, required: true, min: 0, max: JUDGING_STARS_MAX },
    importBatchId: {
      type: Schema.Types.ObjectId,
      ref: "JudgingImportBatch",
      required: true,
    },
  },
  { collection: "judging_scores", timestamps: true },
);
scoreSchema.index(
  { roundId: 1, panelNumber: 1, evaluatorNumber: 1, teamId: 1 },
  { unique: true },
);
scoreSchema.index({ roundId: 1, evaluatorNumber: 1 });

const normalizedSchema = new Schema<NormalizedJudgeScore>(
  {
    roundId,
    roundType,
    panelNumber: { type: String, required: true },
    evaluatorNumber: { type: String, required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamUnstopId: { type: String, required: true },
    rawScore: { type: Number, required: true },
    mean: { type: Number, required: true },
    standardDeviation: { type: Number, required: true },
    zScore: { type: Number, required: true },
    stars: { type: Number, required: true },
    calculationVersion: { type: Number, required: true },
    calculatedAt: { type: Date, required: true },
  },
  { collection: "normalized_judging_scores", timestamps: false },
);
normalizedSchema.index(
  { roundId: 1, evaluatorNumber: 1, teamId: 1 },
  { unique: true },
);

const resultSchema = new Schema<TeamJudgingResult>(
  {
    roundId,
    roundType,
    panelNumber: { type: String, required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamUnstopId: { type: String, required: true },
    evaluatorScores: {
      type: [
        {
          _id: false,
          evaluatorNumber: { type: String, required: true },
          normalizedScore: { type: Number, required: true },
          stars: { type: Number, required: true },
        },
      ],
      required: true,
    },
    finalNormalizedScore: { type: Number, required: true },
    totalStars: { type: Number, required: true },
    rank: { type: Number, required: true },
    calculationVersion: { type: Number, required: true },
    calculatedAt: { type: Date, required: true },
  },
  { collection: "team_judging_results", timestamps: false },
);
resultSchema.index({ roundId: 1, teamId: 1 }, { unique: true });
resultSchema.index({ roundId: 1, rank: 1 });

const importBatchSchema = new Schema<JudgingImportBatch>(
  {
    roundId,
    roundType,
    filename: { type: String, required: true, maxlength: 255 },
    importedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    rowCount: { type: Number, required: true, min: 1 },
  },
  { collection: "judging_import_batches", timestamps: { createdAt: true, updatedAt: false } },
);

export const JudgingRoundModel = model<JudgingRound>(
  "JudgingRound",
  judgingRoundSchema,
);
export const JudgeScoreModel = model<JudgeScore>("JudgeScore", scoreSchema);
export const NormalizedJudgeScoreModel = model<NormalizedJudgeScore>(
  "NormalizedJudgeScore",
  normalizedSchema,
);
export const TeamJudgingResultModel = model<TeamJudgingResult>(
  "TeamJudgingResult",
  resultSchema,
);
export const JudgingImportBatchModel = model<JudgingImportBatch>(
  "JudgingImportBatch",
  importBatchSchema,
);
