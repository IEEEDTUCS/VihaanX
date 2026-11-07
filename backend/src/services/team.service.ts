import { Types } from "mongoose";

import {
  ADMIN_PAGE_SIZE,
  ERROR_CODES,
  EXPORT_MAX_ROWS,
  TEAM_CATEGORY_LABELS,
} from "../config/constants";
import type {
  CheckpointReviewStatus,
  CheckpointRound,
  TeamCategory,
  TeamStatusFilter,
  TeamWorld,
} from "../config/constants";
import { env } from "../config/env";
import { CHECKPOINT_WINDOWS, graceSeconds } from "../config/event";
import { trackName } from "../config/tracks";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import { TeamModel } from "../models/team.model";
import type { SubmissionReview, Team } from "../models/team.model";
import { TEAM_SORT_ORDERS } from "../schemas/team.schema";
import type {
  ExportTeamsQuery,
  ListTeamsQuery,
  ReviewBody,
  UpdateTeamBody,
} from "../schemas/team.schema";
import { ApiError } from "../utils/ApiError";
import { escapeRegex } from "../utils/regex";
import { logActivity } from "./activity.service";
import { toVolunteerTeam } from "./checkin.service";
import { checkCommit, checkProjectRepo } from "./github.service";
import {
  countTeamMembers,
  listTeamMembersForAdmin,
} from "./participant.service";
import {
  checkpointsOf,
  projectOf,
  saveCheckpointResult,
  saveProjectResult,
  settleCheck,
  toAdminCheckpoint,
  toAdminProject,
} from "./submission.service";
import {
  releaseSpacesInRoom,
  reserveSpacesInRoom,
  teamSpaces,
} from "./room.service";

type TeamRecord = Team & { _id: unknown };

export type UpsertTeamInput = {
  unstopId: string;
  name: string;
  world: TeamWorld;
};

export const upsertTeam = async (input: UpsertTeamInput) => {
  const result = await TeamModel.findOneAndUpdate(
    { unstopId: input.unstopId },
    { $set: { name: input.name, world: input.world } },
    {
      upsert: true,
      returnDocument: "after",
      includeResultMetadata: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  const team = result.value;
  if (!team) {
    throw new Error(`Team ${input.unstopId} was neither found nor created`);
  }

  return {
    id: String(team._id),
    unstopId: team.unstopId,
    created: result.lastErrorObject?.updatedExisting !== true,
  };
};

export const setTeamCategories = async (
  unstopId: string,
  categories: TeamCategory[],
) => {
  const updated = await TeamModel.findOneAndUpdate(
    { unstopId },
    { $set: { categories } },
    { returnDocument: "after", runValidators: true },
  ).lean();

  return updated === null ? null : { id: String(updated._id), unstopId };
};

export const listAllTeams = async () =>
  TeamModel.find()
    .select("unstopId name world categories")
    .sort({ unstopId: 1 })
    .lean();

const statusClause = (status: TeamStatusFilter) => {
  if (status === "UNREVIEWED") {
    return {
      $or: [
        { "project.submittedAt": { $ne: null }, "project.reviewStatus": null },
        {
          checkpoints: {
            $elemMatch: { submittedAt: { $ne: null }, reviewStatus: null },
          },
        },
      ],
    };
  }

  return {
    $or: [
      { "project.autoStatus": status },
      { checkpoints: { $elemMatch: { autoStatus: status } } },
    ],
  };
};

export const teamFilter = (query: ExportTeamsQuery) => {
  const filter: Record<string, unknown> = {};
  const clauses: Record<string, unknown>[] = [];

  if (query.world) filter.world = query.world;
  if (query.category) filter.categories = query.category;
  if (query.track) filter["project.tracks"] = query.track;

  if (query.search) {
    const pattern = { $regex: escapeRegex(query.search), $options: "i" };
    clauses.push({ $or: [{ name: pattern }, { unstopId: pattern }] });
  }

  if (query.status) clauses.push(statusClause(query.status));

  if (clauses.length > 0) filter.$and = clauses;

  return filter;
};

export const listTeams = async (query: ListTeamsQuery) => {
  const filter = teamFilter(query);

  const [rows, total] = await Promise.all([
    TeamModel.find(filter)
      .select(
        "unstopId name world categories room bedsheetsIssued panel points stars",
      )
      .sort(TEAM_SORT_ORDERS[query.sort])
      .skip((query.page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    TeamModel.countDocuments(filter),
  ]);

  const counts = await ParticipantModel.aggregate<{
    _id: unknown;
    members: number;
    present: number;
  }>([
    { $match: { teamId: { $in: rows.map((row) => row._id) } } },
    {
      $group: {
        _id: "$teamId",
        members: { $sum: 1 },
        present: { $sum: { $cond: ["$checkedIn", 1, 0] } },
      },
    },
  ]);

  const byTeam = new Map(
    counts.map((count) => [
      String(count._id),
      { members: count.members, present: count.present },
    ]),
  );

  return {
    teams: rows.map((row) => ({
      id: String(row._id),
      unstopId: row.unstopId,
      name: row.name,
      world: row.world,
      categories: row.categories,
      room: row.room,
      bedsheetsIssued: row.bedsheetsIssued ?? 0,
      panel: row.panel,
      points: row.points,
      stars: row.stars,
      memberCount: byTeam.get(String(row._id))?.members ?? 0,
      presentCount: byTeam.get(String(row._id))?.present ?? 0,
    })),
    page: query.page,
    pageSize: ADMIN_PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
};

export const toAdminTeam = (team: TeamRecord, memberCount: number) => ({
  id: String(team._id),
  unstopId: team.unstopId,
  name: team.name,
  world: team.world,
  categories: team.categories,
  project: toAdminProject(projectOf(team)),
  checkpoints: checkpointsOf(team).map(toAdminCheckpoint),
  room: team.room,
  bedsheetsIssued: team.bedsheetsIssued ?? 0,
  memberCount,
  panel: team.panel,
  points: team.points,
  stars: team.stars,
  createdAt: team.createdAt,
});

export const getTeamForAdmin = async (id: string) => {
  const team = await TeamModel.findById(id).lean();

  if (!team) {
    throw new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);
  }

  const members = await listTeamMembersForAdmin(String(team._id));

  return { team: toAdminTeam(team, members.length), members };
};

export type TeamComposition = {
  unstopId: string;
  name: string;
  leaders: number;
  members: number;
};

export const teamCompositions = async (): Promise<TeamComposition[]> => {
  const rows = await TeamModel.aggregate<TeamComposition>([
    {
      $lookup: {
        from: "participants",
        localField: "_id",
        foreignField: "teamId",
        as: "people",
      },
    },
    {
      $project: {
        _id: 0,
        unstopId: 1,
        name: 1,
        members: { $size: "$people" },
        leaders: {
          $size: {
            $filter: {
              input: "$people",
              cond: { $eq: ["$$this.role", "LEADER"] },
            },
          },
        },
      },
    },
    { $sort: { unstopId: 1 } },
  ]);

  return rows;
};

const teamNotFound = () =>
  new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);

const notSubmitted = (label: string) =>
  new ApiError(
    409,
    `${label} has not been submitted yet`,
    ERROR_CODES.NOT_SUBMITTED,
  );

const nothingToCheck = () =>
  new ApiError(
    409,
    "An image submission is reviewed by hand; there is nothing to re-check",
    ERROR_CODES.NOTHING_TO_CHECK,
  );

const loadTeam = async (teamId: string) => {
  const team = await TeamModel.findById(teamId).lean();
  if (!team) throw teamNotFound();
  return team;
};

const adminTeam = async (teamId: string) => {
  const [team, memberCount] = await Promise.all([
    TeamModel.findById(teamId).lean(),
    countTeamMembers(teamId),
  ]);

  if (!team) throw teamNotFound();

  return toAdminTeam(team, memberCount);
};

export const setTeamBedsheets = async (
  actorId: string,
  teamId: string,
  count: number,
) => {
  const memberCount = await countTeamMembers(teamId);

  if (count > memberCount) {
    throw new ApiError(
      400,
      `A team of ${memberCount} cannot be issued ${count} bedsheets`,
      ERROR_CODES.VALIDATION_ERROR,
    );
  }

  const previous = await TeamModel.findOneAndUpdate(
    { _id: teamId },
    { $set: { bedsheetsIssued: count } },
    { returnDocument: "before", runValidators: true },
  ).lean();

  if (!previous) throw teamNotFound();

  const changed = (previous.bedsheetsIssued ?? 0) !== count;

  if (changed) {
    await logActivity({
      actorId,
      action: "BEDSHEETS_SET",
      teamId,
      details: { from: previous.bedsheetsIssued ?? 0, to: count, memberCount },
    });
  }

  return {
    team: toVolunteerTeam({ ...previous, bedsheetsIssued: count }, memberCount),
    changed,
  };
};

export const moveTeamRoom = async (
  actorId: string,
  teamId: string,
  room: string,
) => {
  const team = await TeamModel.findById(teamId).lean();

  if (!team) throw teamNotFound();

  const memberCount = await countTeamMembers(teamId);

  if (team.room === room) {
    return { team: toVolunteerTeam(team, memberCount), changed: false };
  }

  const spaces = teamSpaces(memberCount);
  const reserved = await reserveSpacesInRoom(room, spaces);

  if (!reserved) {
    const exists = await RoomModel.exists({ number: room });

    if (!exists) {
      throw new ApiError(404, "Room not found", ERROR_CODES.ROOM_NOT_FOUND);
    }

    throw new ApiError(
      409,
      `Room ${room} does not have ${spaces} free spaces`,
      ERROR_CODES.NO_ROOM_AVAILABLE,
    );
  }

  const moved = await TeamModel.updateOne(
    { _id: teamId, room: team.room },
    { $set: { room } },
  );

  if (moved.matchedCount === 0) {
    await releaseSpacesInRoom(room, spaces);
    throw new ApiError(
      409,
      "The team's room changed while this move was in flight; try again",
      ERROR_CODES.CONFLICT,
    );
  }

  if (team.room !== null) {
    await releaseSpacesInRoom(team.room, spaces);
  }

  await logActivity({
    actorId,
    action: "ROOM_CHANGED",
    teamId,
    details: { from: team.room, to: room, spaces },
  });

  return {
    team: toVolunteerTeam({ ...team, room }, memberCount),
    changed: true,
  };
};

const TEAM_UPDATE_FIELDS = [
  "panel",
  "points",
  "stars",
  "world",
  "categories",
] as const;

const sameFieldValue = (a: unknown, b: unknown) =>
  Array.isArray(a) && Array.isArray(b)
    ? a.length === b.length && a.every((value, index) => value === b[index])
    : (a ?? null) === (b ?? null);

export const updateTeamAsAdmin = async (
  actorId: string,
  teamId: string,
  body: UpdateTeamBody,
) => {
  const set: Record<string, unknown> = {};

  for (const field of TEAM_UPDATE_FIELDS) {
    const value = body[field];
    if (value !== undefined) set[field] = value;
  }

  const previous = await TeamModel.findOneAndUpdate(
    { _id: teamId },
    { $set: set },
    { returnDocument: "before", runValidators: true },
  ).lean();

  if (!previous) throw teamNotFound();

  const from: Record<string, unknown> = {};
  const to: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(set)) {
    const old = previous[field as keyof Team] ?? null;
    if (sameFieldValue(old, value)) continue;
    from[field] = old;
    to[field] = value;
  }

  if (Object.keys(to).length > 0) {
    await logActivity({
      actorId,
      action: "TEAM_UPDATED",
      teamId,
      details: { from, to },
    });
  }

  return { team: await adminTeam(teamId) };
};

const appliedReview = (
  body: ReviewBody,
  actorId: string,
  now: Date,
): SubmissionReview =>
  body.status === null
    ? {
        reviewStatus: null,
        reviewNote: null,
        reviewedBy: null,
        reviewedAt: null,
      }
    : {
        reviewStatus: body.status,
        reviewNote: body.note ?? null,
        reviewedBy: new Types.ObjectId(actorId),
        reviewedAt: now,
      };

const reviewSet = (prefix: string, review: SubmissionReview) => ({
  [`${prefix}reviewStatus`]: review.reviewStatus,
  [`${prefix}reviewNote`]: review.reviewNote,
  [`${prefix}reviewedBy`]: review.reviewedBy,
  [`${prefix}reviewedAt`]: review.reviewedAt,
});

const reviewChanged = (
  before: {
    reviewStatus: CheckpointReviewStatus | null;
    reviewNote: string | null;
  },
  after: SubmissionReview,
) =>
  before.reviewStatus !== after.reviewStatus ||
  (before.reviewNote ?? null) !== after.reviewNote;

export const reviewProjectSubmission = async (
  actorId: string,
  teamId: string,
  body: ReviewBody,
) => {
  const review = appliedReview(body, actorId, new Date());

  const previous = await TeamModel.findOneAndUpdate(
    { _id: teamId, "project.submittedAt": { $ne: null } },
    { $set: reviewSet("project.", review) },
    { returnDocument: "before", runValidators: true },
  ).lean();

  if (!previous) {
    await loadTeam(teamId);
    throw notSubmitted("The project");
  }

  const before = projectOf(previous);

  if (reviewChanged(before, review)) {
    await logActivity({
      actorId,
      action: "PROJECT_REVIEWED",
      teamId,
      details: {
        from: { status: before.reviewStatus, note: before.reviewNote },
        to: { status: review.reviewStatus, note: review.reviewNote },
      },
    });
  }

  return { team: await adminTeam(teamId) };
};

export const reviewCheckpointSubmission = async (
  actorId: string,
  teamId: string,
  round: CheckpointRound,
  body: ReviewBody,
) => {
  const review = appliedReview(body, actorId, new Date());

  const previous = await TeamModel.findOneAndUpdate(
    {
      _id: teamId,
      checkpoints: { $elemMatch: { round, submittedAt: { $ne: null } } },
    },
    { $set: reviewSet("checkpoints.$.", review) },
    { returnDocument: "before", runValidators: true },
  ).lean();

  if (!previous) {
    await loadTeam(teamId);
    throw notSubmitted(`Round ${round}`);
  }

  const before = checkpointsOf(previous).find((entry) => entry.round === round);

  if (before && reviewChanged(before, review)) {
    await logActivity({
      actorId,
      action: "CHECKPOINT_REVIEWED",
      teamId,
      details: {
        round,
        from: { status: before.reviewStatus, note: before.reviewNote },
        to: { status: review.reviewStatus, note: review.reviewNote },
      },
    });
  }

  return { team: await adminTeam(teamId) };
};

export const recheckProject = async (actorId: string, teamId: string) => {
  const team = await loadTeam(teamId);
  const project = projectOf(team);

  const submittedAt = project.submittedAt;
  const repoUrl = project.repoUrl;

  if (submittedAt === null) throw notSubmitted("The project");
  if (team.world !== "SOFTWARE" || !repoUrl) throw nothingToCheck();

  const { result, applied } = await settleCheck({
    target: "project re-check",
    unstopId: team.unstopId,
    check: () => checkProjectRepo(repoUrl, env.EVENT_START),
    write: (outcome) => saveProjectResult(teamId, submittedAt, outcome),
  });

  await logActivity({
    actorId,
    action: "CHECK_RERUN",
    teamId,
    details: {
      target: "project",
      from: project.autoStatus,
      to: result.autoStatus,
      flags: result.autoFlags,
      applied,
    },
  });

  return { team: await adminTeam(teamId) };
};

export const recheckCheckpoint = async (
  actorId: string,
  teamId: string,
  round: CheckpointRound,
) => {
  const team = await loadTeam(teamId);
  const entries = checkpointsOf(team);
  const entry = entries.find((candidate) => candidate.round === round);

  const submittedAt = entry?.submittedAt ?? null;
  const commitUrl = entry?.url ?? null;

  if (!entry || submittedAt === null) throw notSubmitted(`Round ${round}`);
  if (team.world !== "SOFTWARE" || !commitUrl) throw nothingToCheck();

  const project = projectOf(team);

  const { result, applied } = await settleCheck({
    target: `checkpoint ${round} re-check`,
    unstopId: team.unstopId,
    check: () =>
      checkCommit({
        commitUrl,
        projectRepoUrl: project.repoUrl,
        window: CHECKPOINT_WINDOWS[round],
        graceSeconds: graceSeconds(),
        usedShas: entries
          .filter(
            (candidate) =>
              candidate.round !== round && candidate.commitSha !== null,
          )
          .map((candidate) => ({
            round: candidate.round,
            commitSha: candidate.commitSha!,
          })),
      }),
    write: (outcome) =>
      saveCheckpointResult(teamId, round, submittedAt, outcome),
  });

  await logActivity({
    actorId,
    action: "CHECK_RERUN",
    teamId,
    details: {
      target: "checkpoint",
      round,
      from: entry.autoStatus,
      to: result.autoStatus,
      flags: result.autoFlags,
      applied,
    },
  });

  return { team: await adminTeam(teamId) };
};

const categoryLabels = (categories: TeamCategory[]) =>
  categories.map((category) => TEAM_CATEGORY_LABELS[category]).join(";");

const trackLabels = (tracks: string[]) =>
  tracks.map((id) => trackName(id) ?? id).join(";");

const review = (status: CheckpointReviewStatus | null) => status ?? "";

export const TEAM_EXPORT_HEADER = [
  "Team Name",
  "Unstop ID",
  "World",
  "Categories",
  "Tracks",
  "Room",
  "Panel",
  "Points",
  "Stars",
  "Project URL",
  "Project Status",
  "Project Review",
  ...[1, 2, 3, 4].flatMap((round) => [
    `Checkpoint ${round} Status`,
    `Checkpoint ${round} Review`,
  ]),
];

const teamExportRow = (team: TeamRecord) => {
  const project = projectOf(team);

  return [
    team.name,
    team.unstopId,
    team.world,
    categoryLabels(team.categories),
    trackLabels(project.tracks),
    team.room ?? "",
    team.panel ?? "",
    String(team.points),
    String(team.stars),
    project.repoUrl ?? project.imageUrl ?? "",
    project.autoStatus,
    review(project.reviewStatus),
    ...checkpointsOf(team).flatMap((entry) => [
      entry.autoStatus,
      review(entry.reviewStatus),
    ]),
  ];
};

export const listTeamRowsForExport = async (query: ExportTeamsQuery) => {
  const teams = await TeamModel.find(teamFilter(query))
    .sort(TEAM_SORT_ORDERS[query.sort])
    .limit(EXPORT_MAX_ROWS)
    .lean();

  return { header: TEAM_EXPORT_HEADER, rows: teams.map(teamExportRow) };
};

export const RESULTS_EXPORT_HEADER = [
  "Rank",
  "Team Name",
  "Unstop ID",
  "Points",
  "Stars",
  "World",
  "Categories",
  "Tracks",
  "Panel",
  "Project URL",
  ...[1, 2, 3, 4].map((round) => `Checkpoint ${round} Status`),
];

export const rankedTeamsForExport = async () => {
  const teams = await TeamModel.find()
    .sort({ points: -1, stars: -1, name: 1, _id: 1 })
    .limit(EXPORT_MAX_ROWS)
    .lean();

  const rows = teams.map((team, index) => {
    const project = projectOf(team);

    return [
      String(index + 1),
      team.name,
      team.unstopId,
      String(team.points),
      String(team.stars),
      team.world,
      categoryLabels(team.categories),
      trackLabels(project.tracks),
      team.panel ?? "",
      project.repoUrl ?? project.imageUrl ?? "",
      ...checkpointsOf(team).map((entry) => entry.autoStatus),
    ];
  });

  return { header: RESULTS_EXPORT_HEADER, rows };
};
