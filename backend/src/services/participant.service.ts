import { Types } from "mongoose";

import {
  ADMIN_PAGE_SIZE,
  ERROR_CODES,
  RSVP_CODE_MAX_ATTEMPTS,
} from "../config/constants";
import type { ParticipantRole, TeamWorld } from "../config/constants";
import { ParticipantModel } from "../models/participant.model";
import type { Participant } from "../models/participant.model";
import { TeamModel } from "../models/team.model";
import type { ListParticipantsQuery } from "../schemas/participant.schema";
import { ApiError } from "../utils/ApiError";
import { escapeRegex } from "../utils/regex";
import { generateRsvpCode } from "../utils/rsvpCode";

export type PublicParticipant = {
  id: string;
  name: string;
  email: string;
  role: ParticipantRole;
  teamId: string;
  checkedIn: boolean;
  checkedInAt: Date | null;
  mealsTaken: string[];
  createdAt: Date;
};

type ParticipantRecord = Participant & { _id: unknown };

export const toPublicParticipant = (
  participant: ParticipantRecord,
): PublicParticipant => ({
  id: String(participant._id),
  name: participant.name,
  email: participant.email,
  role: participant.role,
  teamId: String(participant.teamId),
  checkedIn: participant.checkedIn,
  checkedInAt: participant.checkedInAt,
  mealsTaken: participant.mealsTaken,
  createdAt: participant.createdAt,
});

export const findParticipantForAuth = async (id: string) =>
  ParticipantModel.findById(id).select("+tokenVersion").lean();

export const findParticipantForLogin = async (email: string) =>
  ParticipantModel.findOne({ email: email.trim().toLowerCase() })
    .select("+rsvpCode +qrCode +tokenVersion")
    .lean();

export const setParticipantRefreshTokenHash = async (
  id: string,
  hash: string,
) =>
  ParticipantModel.findOneAndUpdate(
    { _id: id },
    { $set: { refreshTokenHash: hash } },
    { returnDocument: "after", projection: "+tokenVersion" },
  ).lean();

export const rotateParticipantRefreshTokenHash = async (
  id: string,
  currentHash: string,
  nextHash: string,
) =>
  ParticipantModel.findOneAndUpdate(
    { _id: id, refreshTokenHash: currentHash },
    { $set: { refreshTokenHash: nextHash } },
    { returnDocument: "after", projection: "+tokenVersion" },
  ).lean();

export const revokeParticipantTokens = async (id: string) => {
  await ParticipantModel.updateOne(
    { _id: id },
    { $set: { refreshTokenHash: null }, $inc: { tokenVersion: 1 } },
  );
};

export const countTeamMembers = async (teamId: string) =>
  ParticipantModel.countDocuments({ teamId });

export const getParticipantWithTeam = async (
  participantId: string,
  teamId: string,
) => {
  const [participant, team, members] = await Promise.all([
    ParticipantModel.findById(participantId).lean(),
    TeamModel.findById(teamId).lean(),
    ParticipantModel.find({ teamId })
      .select("name role checkedIn")
      .sort({ role: 1, name: 1 })
      .lean(),
  ]);

  if (!participant || !team) {
    throw new ApiError(404, "Participant not found", ERROR_CODES.NOT_FOUND);
  }

  return {
    participant: {
      id: String(participant._id),
      name: participant.name,
      email: participant.email,
      college: participant.college,
      role: participant.role,
      checkedIn: participant.checkedIn,
      checkedInAt: participant.checkedInAt,
      mealsTaken: participant.mealsTaken,
    },
    team: {
      id: String(team._id),
      name: team.name,
      world: team.world,
      categories: team.categories,
      room: team.room,
      bedsheetsIssued: team.bedsheetsIssued ?? 0,
      memberCount: members.length,
      members: members.map((member) => ({
        id: String(member._id),
        name: member.name,
        role: member.role,
        checkedIn: member.checkedIn,
      })),
    },
  };
};

type TeamSummary = {
  id: string;
  unstopId: string;
  name: string;
  world: TeamWorld;
};

const teamSummaries = async (teamIds: Types.ObjectId[]) => {
  const unique = [...new Map(teamIds.map((id) => [String(id), id])).values()];

  const teams = await TeamModel.find({ _id: { $in: unique } })
    .select("unstopId name world")
    .lean();

  return new Map<string, TeamSummary>(
    teams.map((team) => [
      String(team._id),
      {
        id: String(team._id),
        unstopId: team.unstopId,
        name: team.name,
        world: team.world,
      },
    ]),
  );
};

export const listParticipants = async (query: ListParticipantsQuery) => {
  const filter: Record<string, unknown> = {};

  if (query.role) filter.role = query.role;
  if (query.present !== undefined) filter.checkedIn = query.present;

  if (query.search) {
    const pattern = { $regex: escapeRegex(query.search), $options: "i" };

    const matchingTeams = await TeamModel.find({ name: pattern })
      .select("_id")
      .lean();

    filter.$or = [
      { name: pattern },
      { email: pattern },
      { college: pattern },
      ...(matchingTeams.length > 0
        ? [{ teamId: { $in: matchingTeams.map((team) => team._id) } }]
        : []),
    ];
  }

  const [rows, total] = await Promise.all([
    ParticipantModel.find(filter)
      .select("+rsvpCode +phone")
      .sort({ name: 1, _id: 1 })
      .skip((query.page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    ParticipantModel.countDocuments(filter),
  ]);

  const teams = await teamSummaries(rows.map((row) => row.teamId));

  return {
    participants: rows.map((row) => ({
      id: String(row._id),
      name: row.name,
      email: row.email,
      college: row.college,
      role: row.role,
      phone: row.phone,
      rsvpCode: row.rsvpCode,
      checkedIn: row.checkedIn,
      checkedInAt: row.checkedInAt,
      mealsTaken: row.mealsTaken,
      team: teams.get(String(row.teamId)) ?? null,
    })),
    page: query.page,
    pageSize: ADMIN_PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
};

export const listTeamMembersForAdmin = async (teamId: string) => {
  const members = await ParticipantModel.find({ teamId })
    .select("+rsvpCode +phone")
    .sort({ role: 1, name: 1 })
    .lean();

  return members.map((member) => ({
    id: String(member._id),
    name: member.name,
    email: member.email,
    college: member.college,
    role: member.role,
    phone: member.phone,
    rsvpCode: member.rsvpCode,
    checkedIn: member.checkedIn,
    checkedInAt: member.checkedInAt,
    mealsTaken: member.mealsTaken,
  }));
};

export type UpsertParticipantInput = {
  teamId: string;
  name: string;
  email: string;
  college: string;
  role: ParticipantRole;
  phone: string | null;
};

export const duplicateKeyFields = (error: unknown): string[] | null => {
  if (typeof error !== "object" || error === null) return null;
  if (!("code" in error) || (error as { code: unknown }).code !== 11000) {
    return null;
  }

  const pattern = (error as { keyPattern?: Record<string, unknown> })
    .keyPattern;

  return pattern ? Object.keys(pattern) : [];
};

export class LeaderConflictError extends Error {
  constructor(public readonly teamId: string) {
    super("team already has a different leader");
  }
}

export const upsertParticipant = async (input: UpsertParticipantInput) => {
  for (let attempt = 0; attempt < RSVP_CODE_MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await ParticipantModel.findOneAndUpdate(
        { email: input.email },
        {
          $set: {
            teamId: new Types.ObjectId(input.teamId),
            name: input.name,
            college: input.college,
            role: input.role,
            phone: input.role === "LEADER" ? input.phone : null,
          },
          $setOnInsert: { rsvpCode: generateRsvpCode() },
        },
        {
          upsert: true,
          returnDocument: "after",
          includeResultMetadata: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      const participant = result.value;
      if (!participant) {
        throw new Error(`Participant ${input.email} was not written`);
      }

      return {
        id: String(participant._id),
        created: result.lastErrorObject?.updatedExisting !== true,
      };
    } catch (error) {
      const fields = duplicateKeyFields(error);

      if (fields?.includes("teamId")) {
        throw new LeaderConflictError(input.teamId);
      }

      if (fields && (fields.includes("rsvpCode") || fields.includes("email"))) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `Could not generate a unique RSVP code for ${input.email} after ${RSVP_CODE_MAX_ATTEMPTS} attempts`,
  );
};

export const listParticipantsForExport = async () => {
  const participants = await ParticipantModel.find()
    .select("+rsvpCode")
    .sort({ teamId: 1, role: 1, name: 1 })
    .lean();

  const teams = await teamSummaries(participants.map((row) => row.teamId));

  return participants.map((row) => ({
    name: row.name,
    email: row.email,
    teamName: teams.get(String(row.teamId))?.name ?? "",
    role: row.role,
    rsvpCode: row.rsvpCode,
  }));
};
