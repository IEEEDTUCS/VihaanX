import { parse } from "csv-parse/sync";
import { Types } from "mongoose";

import {
  JUDGING_REQUIRED_EVALUATORS,
  JUDGING_ROUND_TYPES,
} from "../config/constants";
import type { JudgingRoundType } from "../config/constants";
import { TeamModel } from "../models/team.model";
import {
  JudgeScoreModel,
  JudgingImportBatchModel,
  JudgingRoundModel,
  NormalizedJudgeScoreModel,
  TeamJudgingResultModel,
} from "../models/judging.model";
import { scoreRowSchema } from "../schemas/judging.schema";
import type { ScoreRow } from "../schemas/judging.schema";
import { ApiError } from "../utils/ApiError";
import { normalizeScores } from "../utils/judging";
import { logActivity } from "./activity.service";

type RoundInput = { roundId: string; roundType: JudgingRoundType };

type ParsedScore = ScoreRow & {
  line: number;
};

type ImportIssue = { line: number; message: string };

const requiredHeaders = [
  "round_type",
  "panel_number",
  "evaluator_number",
  "team_id",
  "total_score",
  "stars",
];

const readCell = (row: string[], indexes: Record<string, number>, name: string) =>
  (row[indexes[name]!] ?? "").trim();

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
};

const parseScoreCsv = (buffer: Buffer, expectedRoundType: JudgingRoundType) => {
  let records: string[][];

  try {
    records = parse(buffer.toString("utf8"), {
      bom: true,
      skipEmptyLines: true,
      relaxColumnCount: true,
      trim: true,
    }) as string[][];
  } catch (error) {
    throw new ApiError(
      400,
      `Invalid CSV: ${error instanceof Error ? error.message : String(error)}`,
      "VALIDATION_ERROR",
    );
  }

  const [header = [], ...rows] = records;
  const indexes = Object.fromEntries(
    header.map((value, index) => [value.trim().toLowerCase(), index]),
  );
  const missing = requiredHeaders.filter((name) => indexes[name] === undefined);

  if (missing.length > 0) {
    throw new ApiError(
      400,
      `CSV is missing required columns: ${missing.join(", ")}`,
      "VALIDATION_ERROR",
    );
  }

  const parsed: ParsedScore[] = [];
  const issues: ImportIssue[] = [];

  rows.forEach((row, index) => {
    const line = index + 2;
    const candidate = {
      roundType: readCell(row, indexes, "round_type").toUpperCase(),
      panelNumber: readCell(row, indexes, "panel_number"),
      evaluatorNumber: readCell(row, indexes, "evaluator_number"),
      teamId: readCell(row, indexes, "team_id"),
      totalScore: parseNumber(readCell(row, indexes, "total_score")),
      stars: parseNumber(readCell(row, indexes, "stars")),
    };

    if (candidate.roundType !== expectedRoundType) {
      issues.push({
        line,
        message: `round_type must be ${expectedRoundType}`,
      });
      return;
    }

    const result = scoreRowSchema.safeParse(candidate);
    if (!result.success) {
      issues.push({
        line,
        message: result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; "),
      });
      return;
    }

    parsed.push({ ...result.data, line });
  });

  const seen = new Set<string>();
  for (const row of parsed) {
    const key = `${row.panelNumber}|${row.evaluatorNumber}|${row.teamId}`;
    if (seen.has(key)) {
      issues.push({ line: row.line, message: "duplicate evaluator/team row" });
    }
    seen.add(key);
  }

  return { rows: parsed, issues };
};

const roundOrThrow = async ({ roundId, roundType }: RoundInput) => {
  const round = await JudgingRoundModel.findOne({ roundId }).lean();
  if (round && round.roundType !== roundType) {
    throw new ApiError(
      409,
      `Round ${roundId} already exists as ${round.roundType}`,
      "CONFLICT",
    );
  }
  return round;
};

const resolveTeams = async (rows: ParsedScore[]) => {
  const ids = [...new Set(rows.map((row) => row.teamId))];
  const teams = await TeamModel.find({ unstopId: { $in: ids } })
    .select("_id unstopId")
    .lean();
  const byUnstopId = new Map(teams.map((team) => [team.unstopId, team]));
  const missing = ids.filter((id) => !byUnstopId.has(id));
  return { byUnstopId, missing };
};

const coverageIssues = (rows: ParsedScore[]) => {
  const byTeam = new Map<string, ParsedScore[]>();
  for (const row of rows) {
    byTeam.set(row.teamId, [...(byTeam.get(row.teamId) ?? []), row]);
  }

  return [...byTeam.entries()]
    .map(([teamId, teamRows]) => {
      const panels = new Set(teamRows.map((row) => row.panelNumber));
      const evaluators = new Set(
        teamRows.map((row) => `${row.panelNumber}|${row.evaluatorNumber}`),
      );
      return {
        teamId,
        scoresFound: teamRows.length,
        panels: [...panels],
        evaluators: evaluators.size,
      };
    })
    .filter(
      (entry) =>
        entry.scoresFound !== JUDGING_REQUIRED_EVALUATORS ||
        entry.panels.length !== 1 ||
        entry.evaluators !== JUDGING_REQUIRED_EVALUATORS,
    );
};

const assertImportable = async (input: RoundInput, rows: ParsedScore[]) => {
  const round = await roundOrThrow(input);
  if (round?.status === "PUBLISHED") {
    throw new ApiError(409, "Published judging rounds cannot accept scores", "CONFLICT");
  }

  const { byUnstopId, missing } = await resolveTeams(rows);
  if (missing.length > 0) {
    throw new ApiError(
      400,
      `Unknown team_id values: ${missing.join(", ")}`,
      "VALIDATION_ERROR",
    );
  }

  const existing = await JudgeScoreModel.find({
    roundId: input.roundId,
    $or: rows.map((row) => ({
      panelNumber: row.panelNumber,
      evaluatorNumber: row.evaluatorNumber,
      teamId: byUnstopId.get(row.teamId)!._id,
    })),
  })
    .select("panelNumber evaluatorNumber teamUnstopId")
    .lean();

  if (existing.length > 0) {
    throw new ApiError(
      409,
      `Scores already exist for ${existing.length} imported row(s); use a new round or remove duplicates`,
      "CONFLICT",
    );
  }

  return { round, byUnstopId };
};

export const previewJudgingScores = async (
  input: RoundInput,
  buffer: Buffer,
) => {
  const parsed = parseScoreCsv(buffer, input.roundType);
  const { byUnstopId, missing } = await resolveTeams(parsed.rows);
  const incompleteTeams = coverageIssues(parsed.rows);

  return {
    roundId: input.roundId,
    roundType: input.roundType,
    rowsRead: parsed.rows.length + parsed.issues.length,
    validRows: parsed.rows.length,
    issues: [
      ...parsed.issues,
      ...missing.map((teamId) => ({ line: 0, message: `Unknown team_id: ${teamId}` })),
    ],
    incompleteTeams,
    knownTeams: byUnstopId.size,
    readyToImport:
      parsed.issues.length === 0 && missing.length === 0 && incompleteTeams.length === 0,
  };
};

export const importJudgingScores = async (
  input: RoundInput,
  buffer: Buffer,
  filename: string,
  adminId: string,
) => {
  const parsed = parseScoreCsv(buffer, input.roundType);
  if (parsed.issues.length > 0) {
    throw new ApiError(400, "Fix CSV validation errors before importing", "VALIDATION_ERROR", {
      issues: parsed.issues,
    });
  }

  const { byUnstopId } = await assertImportable(input, parsed.rows);
  const incomplete = coverageIssues(parsed.rows);
  if (incomplete.length > 0) {
    throw new ApiError(400, "Each team must have exactly two evaluator scores", "VALIDATION_ERROR", {
      teams: incomplete,
    });
  }

  const round =
    (await roundOrThrow(input)) ??
    (await JudgingRoundModel.create({
      roundId: input.roundId,
      roundType: input.roundType,
      requiredEvaluators: JUDGING_REQUIRED_EVALUATORS,
    }));
  const batch = await JudgingImportBatchModel.create({
    roundId: input.roundId,
    roundType: input.roundType,
    filename: filename || "scores.csv",
    importedBy: new Types.ObjectId(adminId),
    rowCount: parsed.rows.length,
  });

  await JudgeScoreModel.insertMany(
    parsed.rows.map((row) => ({
      roundId: input.roundId,
      roundType: input.roundType,
      panelNumber: row.panelNumber,
      evaluatorNumber: row.evaluatorNumber,
      teamId: byUnstopId.get(row.teamId)!._id,
      teamUnstopId: row.teamId,
      totalScore: row.totalScore,
      stars: row.stars,
      importBatchId: batch._id,
    })),
  );

  await logActivity({
    actorId: adminId,
    action: "JUDGING_SCORES_IMPORTED",
    details: {
      roundId: input.roundId,
      roundType: input.roundType,
      rows: parsed.rows.length,
      filename,
    },
  });

  return { roundId: input.roundId, roundType: input.roundType, batchId: String(batch._id), imported: parsed.rows.length, status: round.status };
};

export const calculateJudgingRound = async (input: RoundInput, adminId: string) => {
  const round =
    (await roundOrThrow(input)) ??
    (() => {
      throw new ApiError(404, "Judging round not found", "NOT_FOUND");
    })();
  if (round.status === "PUBLISHED") {
    throw new ApiError(409, "Published judging rounds cannot be recalculated", "CONFLICT");
  }

  const scores = await JudgeScoreModel.find({ roundId: input.roundId }).lean();
  if (scores.length === 0) {
    throw new ApiError(409, "No judging scores have been imported", "BAD_REQUEST");
  }

  const byTeam = new Map<string, typeof scores>();
  const byEvaluator = new Map<string, typeof scores>();
  for (const score of scores) {
    const teamKey = String(score.teamId);
    const evaluatorKey = `${score.panelNumber}|${score.evaluatorNumber}`;
    byTeam.set(teamKey, [...(byTeam.get(teamKey) ?? []), score]);
    byEvaluator.set(evaluatorKey, [...(byEvaluator.get(evaluatorKey) ?? []), score]);
  }

  const incomplete = [...byTeam.values()].filter((teamScores) => {
    const panels = new Set(teamScores.map((score) => score.panelNumber));
    const evaluators = new Set(
      teamScores.map(
        (score) => `${score.panelNumber}|${score.evaluatorNumber}`,
      ),
    );
    return (
      teamScores.length !== round.requiredEvaluators ||
      panels.size !== 1 ||
      evaluators.size !== round.requiredEvaluators
    );
  });
  if (incomplete.length > 0) {
    throw new ApiError(400, "Every team must have exactly two evaluator scores before calculation", "VALIDATION_ERROR");
  }

  const calculatedAt = new Date();
  const version = round.calculationVersion + 1;
  const normalized: object[] = [];
  const normalizedByScoreId = new Map<
    string,
    { mean: number; standardDeviation: number; zScore: number }
  >();

  for (const evaluatorScores of byEvaluator.values()) {
    const values = normalizeScores(
      evaluatorScores.map((score) => ({
        key: String(score._id),
        score: score.totalScore,
      })),
    );
    for (const value of values) {
      normalizedByScoreId.set(value.key, value);
    }
    for (const score of evaluatorScores) {
      const value = normalizedByScoreId.get(String(score._id))!;
      normalized.push({
        roundId: input.roundId,
        roundType: input.roundType,
        panelNumber: score.panelNumber,
        evaluatorNumber: score.evaluatorNumber,
        teamId: score.teamId,
        teamUnstopId: score.teamUnstopId,
        rawScore: score.totalScore,
        mean: value.mean,
        standardDeviation: value.standardDeviation,
        zScore: value.zScore,
        stars: score.stars,
        calculationVersion: version,
        calculatedAt,
      });
    }
  }

  const resultRows = [...byTeam.values()].map((teamScores) => {
    const evaluatorScores = teamScores.map((score) => {
      const normalizedScore = normalizedByScoreId.get(String(score._id))!;
      return {
        evaluatorNumber: score.evaluatorNumber,
        normalizedScore: normalizedScore.zScore,
        stars: score.stars,
      };
    });
    return {
      roundId: input.roundId,
      roundType: input.roundType,
      panelNumber: teamScores[0]!.panelNumber,
      teamId: teamScores[0]!.teamId,
      teamUnstopId: teamScores[0]!.teamUnstopId,
      evaluatorScores,
      finalNormalizedScore: evaluatorScores.reduce((sum, score) => sum + score.normalizedScore, 0),
      totalStars: evaluatorScores.reduce((sum, score) => sum + score.stars, 0),
      rank: 0,
      calculationVersion: version,
      calculatedAt,
    };
  });

  resultRows.sort(
    (a, b) =>
      b.finalNormalizedScore - a.finalNormalizedScore ||
      b.totalStars - a.totalStars ||
      a.teamUnstopId.localeCompare(b.teamUnstopId),
  );
  resultRows.forEach((row, index) => {
    row.rank = index + 1;
  });

  await NormalizedJudgeScoreModel.deleteMany({ roundId: input.roundId });
  await TeamJudgingResultModel.deleteMany({ roundId: input.roundId });
  await NormalizedJudgeScoreModel.insertMany(normalized);
  await TeamJudgingResultModel.insertMany(resultRows);
  await JudgingRoundModel.updateOne(
    { roundId: input.roundId },
    { $set: { status: "CALCULATED", calculationVersion: version, calculatedAt } },
  );

  await logActivity({
    actorId: adminId,
    action: "JUDGING_SCORES_CALCULATED",
    details: { roundId: input.roundId, roundType: input.roundType, version },
  });

  return { roundId: input.roundId, roundType: input.roundType, version, teams: resultRows.length };
};

export const getJudgingResults = async (input: RoundInput) => {
  const rows = await TeamJudgingResultModel.find({ roundId: input.roundId })
    .sort({ rank: 1 })
    .lean();
  return {
    roundId: input.roundId,
    roundType: input.roundType,
    results: rows.map((row) => ({ ...row, id: String(row._id), teamId: String(row.teamId) })),
  };
};

export const validJudgingRoundType = (value: string): value is JudgingRoundType =>
  (JUDGING_ROUND_TYPES as readonly string[]).includes(value);
