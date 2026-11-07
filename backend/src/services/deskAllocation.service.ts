import mongoose, { Types } from "mongoose";
import { ActivityModel } from "../models/activity.model";
import { CardModel } from "../models/card.model";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import { TeamModel } from "../models/team.model";
import { ERROR_CODES } from "../config/constants";
import { ApiError } from "../utils/ApiError";
import { selectAllocation } from "./allocationPlanner";
import { toVolunteerView } from "./checkin.service";

/** Atomically links the badge, records arrival and claims team slots where possible. */
export const linkAndAllocate = async (actorId: string, code: string, rsvpCode: string) => {
  const session = await mongoose.startSession();
  let participantId = "";
  let changed = false;
  let allocationStatus = "UNASSIGNED";
  try {
    await session.withTransaction(async () => {
      // withTransaction may retry: never retain data from a prior attempt.
      changed = false;
      allocationStatus = "UNASSIGNED";
      const card = await CardModel.findOne({ code, revokedAt: null }).session(session).lean();
      if (!card) throw new ApiError(404, "Unknown card", ERROR_CODES.CARD_UNKNOWN);
      const person = await ParticipantModel.findOne({ rsvpCode }).select("+qrCode").session(session);
      if (!person) throw new ApiError(404, "Invalid check-in code", ERROR_CODES.PARTICIPANT_NOT_FOUND);
      if (person.qrCode && person.qrCode !== code) throw new ApiError(409, "Participant already has a card", ERROR_CODES.PARTICIPANT_HAS_CARD);
      const holder = await ParticipantModel.findOne({ qrCode: code }).session(session).lean();
      if (holder && String(holder._id) !== String(person._id)) throw new ApiError(409, "Card is already in use", ERROR_CODES.CARD_IN_USE);
      const team = await TeamModel.findById(person.teamId).session(session);
      if (!team) throw new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);
      const members = await ParticipantModel.find({ teamId: team._id }).select("college").session(session).lean();
      changed = !person.qrCode;
      if (changed || !person.checkedIn) {
        person.qrCode = code;
        person.checkedIn = true;
        person.checkedInAt = person.checkedInAt ?? new Date();
        await person.save({ session });
        if (changed) await ActivityModel.create([{ actorId: new Types.ObjectId(actorId), action: "CARD_LINKED", participantId: person._id, teamId: team._id, details: {} }], { session });
      }
      participantId = String(person._id);
      if (team.room) {
        allocationStatus = team.tables?.length ? "ALLOCATED" : "LEGACY_ROOM_REQUIRES_REVIEW";
        return;
      }
      if (members.length < 1 || members.length > 4) {
        allocationStatus = "INVALID_ROSTER";
        return;
      }
      const rooms = await RoomModel.find({ enabled: { $ne: false }, "slots.0": { $exists: true } }).session(session);
      const assignedTeams = await TeamModel.find({ room: { $ne: null } }).select("room").session(session).lean();
      const participants = await ParticipantModel.find({ teamId: { $in: assignedTeams.map((t) => t._id) } }).select("teamId college").session(session).lean();
      const roomByTeam = new Map(assignedTeams.map((t) => [String(t._id), t.room]));
      const candidate = selectAllocation({ memberCount: members.length, hardware: team.world === "HARDWARE", colleges: members.map((m) => m.college) }, rooms.map((room) => ({
        id: String(room._id), number: room.number, enabled: room.enabled !== false, small: room.small, hardware: room.hardware,
        teamCount: assignedTeams.filter((t) => t.room === room.number).length,
        peopleRemaining: room.available,
        colleges: participants.filter((p) => roomByTeam.get(String(p.teamId)) === room.number).map((p) => p.college),
        slots: room.slots.map((s) => ({ id: s.label, label: s.label, row: s.row, available: s.enabled && !s.teamId })),
      })));
      if (!candidate) return;
      const room = rooms.find((r) => String(r._id) === candidate.roomId)!;
      for (const slot of room.slots) if (candidate.slotIds.includes(slot.label)) slot.teamId = team._id;
      room.available -= members.length;
      await room.save({ session });
      team.room = room.number;
      team.tables = candidate.slotLabels;
      team.allocationRosterSize = members.length;
      await team.save({ session });
      await ActivityModel.create([{ actorId: new Types.ObjectId(actorId), action: "ROOM_ALLOCATED", participantId: person._id, teamId: team._id, details: { room: room.number, tables: candidate.slotLabels, rosterSize: members.length } }], { session });
      allocationStatus = "ALLOCATED";
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) throw new ApiError(409, "Card is already in use", ERROR_CODES.CARD_IN_USE);
    throw error;
  } finally { await session.endSession(); }
  const participant = await ParticipantModel.findById(participantId).lean();
  if (!participant) throw new ApiError(404, "Participant not found", ERROR_CODES.NOT_FOUND);
  return { ...(await toVolunteerView(participant)), changed, allocationStatus };
};

export const replaceCard = async (actorId: string, participantId: string, code: string, reason: string) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const person = await ParticipantModel.findById(participantId).select("+qrCode +tokenVersion").session(session);
      if (!person || !person.qrCode) throw new ApiError(404, "Linked participant not found", ERROR_CODES.NOT_FOUND);
      if (person.qrCode === code) throw new ApiError(409, "Choose a different card", ERROR_CODES.CONFLICT);
      const newCard = await CardModel.findOne({ code, revokedAt: null }).session(session);
      if (!newCard) throw new ApiError(404, "Unknown card", ERROR_CODES.CARD_UNKNOWN);
      if (await ParticipantModel.exists({ qrCode: code }).session(session)) throw new ApiError(409, "Card is already in use", ERROR_CODES.CARD_IN_USE);
      const oldCard = await CardModel.findOne({ code: person.qrCode, revokedAt: null }).session(session);
      if (!oldCard) throw new ApiError(409, "Current card is unavailable", ERROR_CODES.CONFLICT);
      oldCard.revokedAt = new Date();
      await oldCard.save({ session });
      person.qrCode = code;
      person.tokenVersion += 1;
      await person.save({ session });
      await ActivityModel.create([{ actorId: new Types.ObjectId(actorId), action: "CARD_REPLACED", participantId: person._id, teamId: person.teamId, details: { reason } }], { session });
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) throw new ApiError(409, "Card is already in use", ERROR_CODES.CARD_IN_USE);
    throw error;
  } finally { await session.endSession(); }
  const participant = await ParticipantModel.findById(participantId).lean();
  if (!participant) throw new ApiError(404, "Participant not found", ERROR_CODES.NOT_FOUND);
  return toVolunteerView(participant);
};

export const retryAllocation = async (actorId: string, code: string) => {
  const person = await ParticipantModel.findOne({ qrCode: code }).select("+rsvpCode").lean();
  if (!person) throw new ApiError(404, "Card is not linked", ERROR_CODES.CARD_NOT_LINKED);
  return linkAndAllocate(actorId, code, person.rsvpCode);
};

export const moveAllocation = async (actorId: string, teamId: string, roomNumber: string, reason: string) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const team = await TeamModel.findById(teamId).session(session);
      if (!team) throw new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);
      if (team.room === roomNumber && team.tables?.length) return;
      const members = await ParticipantModel.find({ teamId: team._id }).select("college").session(session).lean();
      if (members.length < 1 || members.length > 4) throw new ApiError(409, "Invalid team roster", ERROR_CODES.CONFLICT);
      if (team.room && team.allocationRosterSize !== members.length) throw new ApiError(409, "Team roster changed after allocation; reconcile it first", ERROR_CODES.CONFLICT);
      const target = await RoomModel.findOne({ number: roomNumber, enabled: { $ne: false } }).session(session);
      if (!target) throw new ApiError(404, "Room not found", ERROR_CODES.ROOM_NOT_FOUND);
      const candidate = selectAllocation({ memberCount: members.length, hardware: team.world === "HARDWARE", colleges: members.map((m) => m.college) }, [{ id: String(target._id), number: target.number, enabled: target.enabled !== false, small: target.small, hardware: target.hardware, teamCount: 0, peopleRemaining: target.available, colleges: [], slots: target.slots.map((s) => ({ id: s.label, label: s.label, row: s.row, available: s.enabled && !s.teamId })) }]);
      if (!candidate) throw new ApiError(409, "Room has no suitable slots or capacity", ERROR_CODES.NO_ROOM_AVAILABLE);
      if (team.room) {
        const previous = await RoomModel.findOne({ number: team.room }).session(session);
        if (!previous || !team.tables?.length) throw new ApiError(409, "Legacy room assignment needs migration", ERROR_CODES.CONFLICT);
        const oldSlots = previous.slots.filter((s) => String(s.teamId) === String(team._id));
        if (oldSlots.length !== team.tables.length) throw new ApiError(409, "Existing slot assignment is inconsistent", ERROR_CODES.CONFLICT);
        for (const slot of oldSlots) slot.teamId = null;
        previous.available += members.length;
        if (previous.available > previous.capacity) throw new ApiError(409, "Room capacity is inconsistent", ERROR_CODES.CONFLICT);
        await previous.save({ session });
      }
      const oldRoom = team.room;
      for (const slot of target.slots) if (candidate.slotIds.includes(slot.label)) slot.teamId = team._id;
      target.available -= members.length;
      await target.save({ session });
      team.room = target.number;
      team.tables = candidate.slotLabels;
      team.allocationRosterSize = members.length;
      await team.save({ session });
      await ActivityModel.create([{ actorId: new Types.ObjectId(actorId), action: "ROOM_CHANGED", teamId: team._id, details: { from: oldRoom, to: target.number, tables: candidate.slotLabels, reason } }], { session });
    });
  } finally { await session.endSession(); }
  return { moved: true };
};
