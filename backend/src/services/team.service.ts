import { ADMIN_PAGE_SIZE, ERROR_CODES } from "../config/constants";
import type { TeamCategory, TeamWorld } from "../config/constants";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import { TeamModel } from "../models/team.model";
import { TEAM_SORT_ORDERS } from "../schemas/team.schema";
import type { ListTeamsQuery } from "../schemas/team.schema";
import { ApiError } from "../utils/ApiError";
import { escapeRegex } from "../utils/regex";
import { logActivity } from "./activity.service";
import { toVolunteerTeam } from "./checkin.service";
import {
  countTeamMembers,
  listTeamMembersForAdmin,
} from "./participant.service";
import {
  releaseSpacesInRoom,
  reserveSpacesInRoom,
  teamSpaces,
} from "./room.service";

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
      bedsheetsIssued: team.bedsheetsIssued ?? 0,
      memberCount: members.length,
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

const teamNotFound = () =>
  new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);

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
