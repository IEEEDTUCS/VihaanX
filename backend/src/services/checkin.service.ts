import { ERROR_CODES } from "../config/constants";
import type { ParticipantRole, RoomStatus } from "../config/constants";
import { isMealSlot } from "../config/event";
import { ParticipantModel } from "../models/participant.model";
import type { Participant } from "../models/participant.model";
import { TeamModel } from "../models/team.model";
import type { Team } from "../models/team.model";
import { ApiError } from "../utils/ApiError";
import { logActivity } from "./activity.service";
import { countTeamMembers } from "./participant.service";
import { allocateRoomForTeam } from "./room.service";

type ParticipantRecord = Participant & { _id: unknown };
type TeamRecord = Team & { _id: unknown };

export type VolunteerParticipant = {
  id: string;
  name: string;
  role: ParticipantRole;
  checkedIn: boolean;
  checkedInAt: Date | null;
  mealsTaken: string[];
};

export type VolunteerTeam = {
  id: string;
  name: string;
  world: string;
  room: string | null;
  bedsheetsIssued: number;
  memberCount: number;
};

export type VolunteerView = {
  participant: VolunteerParticipant;
  team: VolunteerTeam;
};

export const toVolunteerParticipant = (
  participant: ParticipantRecord,
): VolunteerParticipant => ({
  id: String(participant._id),
  name: participant.name,
  role: participant.role,
  checkedIn: participant.checkedIn,
  checkedInAt: participant.checkedInAt,
  mealsTaken: participant.mealsTaken,
});

export const toVolunteerTeam = (
  team: TeamRecord,
  memberCount: number,
): VolunteerTeam => ({
  id: String(team._id),
  name: team.name,
  world: team.world,
  room: team.room,
  bedsheetsIssued: team.bedsheetsIssued ?? 0,
  memberCount,
});

export const toVolunteerView = async (
  participant: ParticipantRecord,
): Promise<VolunteerView> => {
  const teamId = String(participant.teamId);

  const [team, memberCount] = await Promise.all([
    TeamModel.findById(teamId).lean(),
    countTeamMembers(teamId),
  ]);

  if (!team) {
    throw new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);
  }

  return {
    participant: toVolunteerParticipant(participant),
    team: toVolunteerTeam(team, memberCount),
  };
};

const participantNotFound = () =>
  new ApiError(404, "Participant not found", ERROR_CODES.NOT_FOUND);

const readParticipant = async (id: string) => {
  const participant = await ParticipantModel.findById(id).lean();
  if (!participant) throw participantNotFound();
  return participant;
};

export type CheckInResult = VolunteerView & {
  roomStatus: RoomStatus;
  changed: boolean;
};

export const checkInParticipant = async (
  actorId: string,
  participantId: string,
): Promise<CheckInResult> => {
  const updated = await ParticipantModel.findOneAndUpdate(
    { _id: participantId, checkedIn: false },
    { $set: { checkedIn: true, checkedInAt: new Date() } },
    { returnDocument: "after" },
  ).lean();

  const participant = updated ?? (await readParticipant(participantId));
  const teamId = String(participant.teamId);

  if (updated) {
    await logActivity({
      actorId,
      action: "CHECKED_IN",
      participantId,
      teamId,
      details: { checkedInAt: updated.checkedInAt },
    });
  }

  const allocation = await allocateRoomForTeam({
    actorId,
    teamId,
    participantId,
  });

  return {
    participant: toVolunteerParticipant(participant),
    team: toVolunteerTeam(allocation.team, allocation.memberCount),
    roomStatus: allocation.status,
    changed: updated !== null,
  };
};

export const undoCheckIn = async (actorId: string, participantId: string) => {
  const updated = await ParticipantModel.findOneAndUpdate(
    { _id: participantId, checkedIn: true },
    { $set: { checkedIn: false, checkedInAt: null } },
    { returnDocument: "after" },
  ).lean();

  const participant = updated ?? (await readParticipant(participantId));

  if (updated) {
    await logActivity({
      actorId,
      action: "CHECK_IN_UNDONE",
      participantId,
      teamId: String(participant.teamId),
    });
  }

  return { ...(await toVolunteerView(participant)), changed: updated !== null };
};

export const serveMeal = async (
  actorId: string,
  participantId: string,
  mealId: string,
) => {
  if (!isMealSlot(mealId)) {
    throw new ApiError(400, "Unknown meal slot", ERROR_CODES.UNKNOWN_MEAL);
  }

  const served = await ParticipantModel.findOneAndUpdate(
    { _id: participantId, checkedIn: true, mealsTaken: { $ne: mealId } },
    { $push: { mealsTaken: mealId } },
    { returnDocument: "after" },
  ).lean();

  if (!served) {
    const participant = await readParticipant(participantId);

    if (!participant.checkedIn) {
      throw new ApiError(
        409,
        "Check this participant in before serving a meal",
        ERROR_CODES.NOT_CHECKED_IN,
      );
    }

    throw new ApiError(
      409,
      `Already served ${mealId}`,
      ERROR_CODES.ALREADY_SERVED,
    );
  }

  await logActivity({
    actorId,
    action: "MEAL_SERVED",
    participantId,
    teamId: String(served.teamId),
    details: { mealId },
  });

  return toVolunteerView(served);
};

export const undoMeal = async (
  actorId: string,
  participantId: string,
  mealId: string,
) => {
  const updated = await ParticipantModel.findOneAndUpdate(
    { _id: participantId, mealsTaken: mealId },
    { $pull: { mealsTaken: mealId } },
    { returnDocument: "after" },
  ).lean();

  const participant = updated ?? (await readParticipant(participantId));

  if (updated) {
    await logActivity({
      actorId,
      action: "MEAL_UNDONE",
      participantId,
      teamId: String(participant.teamId),
      details: { mealId },
    });
  }

  return { ...(await toVolunteerView(participant)), changed: updated !== null };
};


export const shortlistTeam = async (
  actorId: string,
  participantId: string,
) => {
  const participant = await readParticipant(participantId);
  const teamId = String(participant.teamId);

  const result = await TeamModel.updateOne(
    { _id: teamId },
    { $set: { shortlistedForFinals: true } },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);
  }

  await logActivity({
    actorId,
    action: "TEAM_UPDATED",
    participantId,
    teamId,
    details: { shortlistedForFinals: true },
  });

  return toVolunteerView(participant);
};

export const unshortlistTeam = async (
  actorId: string,
  participantId: string,
) => {
  const participant = await readParticipant(participantId);
  const teamId = String(participant.teamId);

  await TeamModel.updateOne(
    { _id: teamId },
    { $set: { shortlistedForFinals: false, pptUrl: null } },
  );

  await logActivity({
    actorId,
    action: "TEAM_UPDATED",
    participantId,
    teamId,
    details: { shortlistedForFinals: false },
  });

  return toVolunteerView(participant);
};

export const assignTable = async (
  actorId: string,
  participantId: string,
  tableNo: string,
) => {
  const participant = await readParticipant(participantId);
  const teamId = String(participant.teamId);

  await TeamModel.updateOne(
    { _id: teamId },
    { $set: { tableNo } },
  );

  await logActivity({
    actorId,
    action: "TEAM_UPDATED",
    participantId,
    teamId,
    details: { tableNo },
  });

  return toVolunteerView(participant);
};
