import { ADMIN_PAGE_SIZE, ERROR_CODES } from "../config/constants";
import type { TeamCategory, TeamWorld } from "../config/constants";
import { ParticipantModel } from "../models/participant.model";
import { TeamModel } from "../models/team.model";
import { TEAM_SORT_ORDERS } from "../schemas/team.schema";
import type { ListTeamsQuery } from "../schemas/team.schema";
import { ApiError } from "../utils/ApiError";
import { escapeRegex } from "../utils/regex";
import { listTeamMembersForAdmin } from "./participant.service";

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

export const listTeams = async (query: ListTeamsQuery) => {
  const filter: Record<string, unknown> = {};

  if (query.world) filter.world = query.world;
  if (query.category) filter.categories = query.category;

  if (query.search) {
    const pattern = { $regex: escapeRegex(query.search), $options: "i" };
    filter.$or = [{ name: pattern }, { unstopId: pattern }];
  }

  const [rows, total] = await Promise.all([
    TeamModel.find(filter)
      .select("unstopId name world categories room panel points stars")
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

export const getTeamForAdmin = async (id: string) => {
  const team = await TeamModel.findById(id).lean();

  if (!team) {
    throw new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);
  }

  const members = await listTeamMembersForAdmin(String(team._id));

  return {
    team: {
      id: String(team._id),
      unstopId: team.unstopId,
      name: team.name,
      world: team.world,
      categories: team.categories,
      tracks: team.tracks,
      description: team.description,
      repoUrl: team.repoUrl,
      imageUrl: team.imageUrl,
      room: team.room,
      panel: team.panel,
      points: team.points,
      stars: team.stars,
      createdAt: team.createdAt,
    },
    members,
  };
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
