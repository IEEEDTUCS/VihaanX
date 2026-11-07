import {
  ERROR_CODES,
  MAX_ROOMS_RETURNED,
  TEAM_WORLDS,
} from "../config/constants";
import type { RoomStatus } from "../config/constants";
import { logger } from "../config/logger";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import type { Room } from "../models/room.model";
import { TeamModel } from "../models/team.model";
import type { Team } from "../models/team.model";
import { ApiError } from "../utils/ApiError";
import { logActivity } from "./activity.service";
import { countTeamMembers } from "./participant.service";

type TeamRecord = Team & { _id: unknown };

export const reserveSpacesInRoom = async (number: string, spaces: number) =>
  RoomModel.findOneAndUpdate(
    { number, available: { $gte: spaces } },
    { $inc: { available: -spaces } },
    { returnDocument: "after" },
  ).lean();

export const releaseSpacesInRoom = async (number: string, spaces: number) => {
  const result = await RoomModel.updateOne(
    {
      number,
      $expr: { $lte: [{ $add: ["$available", spaces] }, "$capacity"] },
    },
    { $inc: { available: spaces } },
  );

  if (result.matchedCount === 0) {
    logger.warn(
      { room: number, spaces },
      "could not return spaces: the room is missing or would exceed capacity",
    );
    return false;
  }

  return true;
};

export const teamSpaces = (memberCount: number) => Math.max(memberCount, 1);

type AllocationInput = {
  actorId: string;
  teamId: string;
  participantId: string;
};

export type Allocation = {
  status: RoomStatus;
  team: TeamRecord;
  memberCount: number;
};

export const allocateRoomForTeam = async ({
  actorId,
  teamId,
  participantId,
}: AllocationInput): Promise<Allocation> => {
  const team = await TeamModel.findById(teamId).lean();

  if (!team) {
    throw new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);
  }

  const memberCount = await countTeamMembers(teamId);

  if (team.room !== null) {
    return { status: "ALREADY_HAD_ROOM", team, memberCount };
  }

  const known = (TEAM_WORLDS as readonly string[]).includes(team.world);

  if (!known) {
    return { status: "TEAM_WORLD_NOT_SET", team, memberCount };
  }

  const spaces = teamSpaces(memberCount);

  const reserved = await RoomModel.findOneAndUpdate(
    { hardware: team.world === "HARDWARE", available: { $gte: spaces } },
    { $inc: { available: -spaces } },
    { sort: { available: -1 }, returnDocument: "after" },
  ).lean();

  if (!reserved) {
    const current = await TeamModel.findById(teamId).lean();

    if (current?.room) {
      return { status: "ALREADY_HAD_ROOM", team: current, memberCount };
    }

    return { status: "NO_ROOM_AVAILABLE", team: current ?? team, memberCount };
  }

  const assigned = await TeamModel.updateOne(
    { _id: teamId, room: null },
    { $set: { room: reserved.number } },
  );

  if (assigned.matchedCount === 0) {
    await releaseSpacesInRoom(reserved.number, spaces);
    const current = await TeamModel.findById(teamId).lean();
    return { status: "ALREADY_HAD_ROOM", team: current ?? team, memberCount };
  }

  await logActivity({
    actorId,
    action: "ROOM_ALLOCATED",
    participantId,
    teamId,
    details: { room: reserved.number, spaces },
  });

  return {
    status: "ALLOCATED",
    team: { ...team, room: reserved.number },
    memberCount,
  };
};

export const listRooms = async () => {
  const rooms = await RoomModel.find()
    .sort({ number: 1 })
    .limit(MAX_ROOMS_RETURNED)
    .lean();

  const teams = await TeamModel.find({ room: { $ne: null } })
    .select("name world room")
    .sort({ name: 1 })
    .lean();

  const counts = await ParticipantModel.aggregate<{
    _id: unknown;
    members: number;
  }>([
    { $match: { teamId: { $in: teams.map((team) => team._id) } } },
    { $group: { _id: "$teamId", members: { $sum: 1 } } },
  ]);

  const memberCounts = new Map(
    counts.map((count) => [String(count._id), count.members]),
  );

  const byRoom = new Map<
    string,
    { id: string; name: string; world: string; memberCount: number }[]
  >();

  for (const team of teams) {
    if (team.room === null) continue;

    const entry = {
      id: String(team._id),
      name: team.name,
      world: team.world,
      memberCount: memberCounts.get(String(team._id)) ?? 0,
    };

    const existing = byRoom.get(team.room);
    if (existing) existing.push(entry);
    else byRoom.set(team.room, [entry]);
  }

  return {
    rooms: rooms.map((room) => ({
      number: room.number,
      capacity: room.capacity,
      available: room.available,
      hardware: room.hardware,
      teams: byRoom.get(room.number) ?? [],
    })),
  };
};

export const spacesTakenByRoom = async () => {
  const rows = await TeamModel.aggregate<{ _id: string; taken: number }>([
    { $match: { room: { $ne: null } } },
    {
      $lookup: {
        from: "participants",
        localField: "_id",
        foreignField: "teamId",
        as: "people",
      },
    },
    {
      $group: {
        _id: "$room",
        taken: { $sum: { $max: [{ $size: "$people" }, 1] } },
      },
    },
  ]);

  return new Map(rows.map((row) => [row._id, row.taken]));
};

export type UpsertRoomInput = {
  number: string;
  capacity: number;
  available: number;
  hardware: boolean;
};

export const upsertRoom = async (input: UpsertRoomInput) => {
  if (input.available < 0 || input.available > input.capacity) {
    throw new Error(
      `Room ${input.number}: available ${input.available} is outside ` +
        `0..${input.capacity}`,
    );
  }

  const result = await RoomModel.findOneAndUpdate(
    { number: input.number },
    {
      $set: {
        capacity: input.capacity,
        available: input.available,
        hardware: input.hardware,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      includeResultMetadata: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  const room = result.value as Room | null;

  if (!room) {
    throw new Error(`Room ${input.number} was neither found nor created`);
  }

  return {
    number: room.number,
    created: result.lastErrorObject?.updatedExisting !== true,
  };
};

export const listAllRoomNumbers = async () => {
  const rooms = await RoomModel.find().select("number").lean();
  return rooms.map((room) => room.number);
};
