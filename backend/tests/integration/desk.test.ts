import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { randomUUID } from "node:crypto";
import mongoose, { Types } from "mongoose";
import { CardModel } from "../../src/models/card.model";
import { ParticipantModel } from "../../src/models/participant.model";
import { RoomModel } from "../../src/models/room.model";
import { TeamModel } from "../../src/models/team.model";
import { ActivityModel } from "../../src/models/activity.model";
import { linkAndAllocate, moveAllocation, replaceCard } from "../../src/services/deskAllocation.service";
import { getCardHolder } from "../../src/services/card.service";
import { serveMeal, undoMeal } from "../../src/services/checkin.service";

const enabled = process.env.RUN_DB_TESTS === "1";
const dbName = `vihaanx_integration_${randomUUID().replaceAll("-", "")}`;
const actorId = new Types.ObjectId().toString();
let teamId = "";
let participantId = "";

before(async () => {
  if (!enabled) return;
  await mongoose.connect(process.env.MONGODB_TEST_URI ?? "mongodb://127.0.0.1:27017/?replicaSet=rs0", { dbName, serverSelectionTimeoutMS: 10000 });
  await Promise.all([CardModel.init(), ParticipantModel.init(), RoomModel.init(), TeamModel.init(), ActivityModel.init()]);
});
after(async () => {
  if (!enabled || !mongoose.connection.db) return;
  // Only the fresh, random database created by this test is removed.
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("link card, allocate a whole team, prevent duplicate meals and replace card", { skip: !enabled }, async () => {
  const team = await TeamModel.create({ unstopId: "U0000001", name: "Test Team", world: "SOFTWARE" });
  teamId = String(team._id);
  const people = await ParticipantModel.create([
    { teamId: team._id, name: "One", email: "one@example.test", college: "DTU", role: "LEADER", rsvpCode: "TEST0001" },
    { teamId: team._id, name: "Two", email: "two@example.test", college: "DTU", role: "MEMBER", rsvpCode: "TEST0002" },
    { teamId: team._id, name: "Three", email: "three@example.test", college: "DTU", role: "MEMBER", rsvpCode: "TEST0003" },
  ]);
  participantId = String(people[0]!._id);
  await CardModel.create([{ code: "10000001" }, { code: "10000002" }, { code: "10000003" }]);
  await RoomModel.create({ number: "104", capacity: 10, available: 10, hardware: false, small: true, slots: [{ label: "104-T1", row: "C2" }, { label: "104-T2", row: "C2" }, { label: "104-T3", row: "C3" }] });
  const first = await linkAndAllocate(actorId, "10000001", "TEST0001");
  assert.equal(first.allocationStatus, "ALLOCATED");
  assert.equal(first.participant.checkedIn, true);
  assert.deepEqual(first.team.tables, ["104-T1", "104-T2"]);
  assert.equal((await RoomModel.findOne({ number: "104" }).lean())?.available, 7);
  const second = await linkAndAllocate(actorId, "10000002", "TEST0002");
  assert.deepEqual(second.team.tables, first.team.tables);
  assert.equal((await RoomModel.findOne({ number: "104" }).lean())?.available, 7);
  assert.equal((await linkAndAllocate(actorId, "10000001", "TEST0001")).changed, false);
  await assert.rejects(() => linkAndAllocate(actorId, "10000001", "TEST0003"));
  await serveMeal(actorId, participantId, "midnight-d1");
  await assert.rejects(() => serveMeal(actorId, participantId, "midnight-d1"));
  await serveMeal(actorId, participantId, "midnight-2-d1");
  await undoMeal(actorId, participantId, "midnight-d1");
  await replaceCard(actorId, participantId, "10000003", "Lost card");
  await assert.rejects(() => getCardHolder("10000001"));
  const replacement = await getCardHolder("10000003");
  assert.equal(replacement.participant.id, participantId);
  assert.deepEqual(replacement.participant.mealsTaken, ["midnight-2-d1"]);
});

test("a room move releases old slots and reserves new slots", { skip: !enabled }, async () => {
  await RoomModel.create({ number: "201", capacity: 10, available: 10, hardware: false, small: false, slots: [{ label: "201-T1", row: "C2" }, { label: "201-T2", row: "C2" }] });
  await moveAllocation(actorId, teamId, "201", "Organizer requested move");
  const oldRoom = await RoomModel.findOne({ number: "104" }).lean();
  const newRoom = await RoomModel.findOne({ number: "201" }).lean();
  const team = await TeamModel.findById(teamId).lean();
  assert.equal(oldRoom?.available, 10);
  assert.equal(oldRoom?.slots.filter((slot) => slot.teamId).length, 0);
  assert.equal(newRoom?.available, 7);
  assert.equal(newRoom?.slots.filter((slot) => String(slot.teamId) === teamId).length, 2);
  assert.deepEqual(team?.tables, ["201-T1", "201-T2"]);
});

test("competing team arrivals cannot claim the same slot", { skip: !enabled }, async () => {
  const teams = await TeamModel.create([{ unstopId: "U0000002", name: "A", world: "HARDWARE" }, { unstopId: "U0000003", name: "B", world: "HARDWARE" }]);
  await ParticipantModel.create(teams.map((team, i) => ({ teamId: team._id, name: `P${i}`, email: `race${i}@example.test`, college: "Other", role: "LEADER" as const, rsvpCode: `RACE000${i}` })));
  await CardModel.create([{ code: "10000004" }, { code: "10000005" }]);
  await RoomModel.create({ number: "H1", capacity: 4, available: 4, hardware: true, small: true, slots: [{ label: "H1-T1", row: "C1" }] });
  const results = await Promise.all([linkAndAllocate(actorId, "10000004", "RACE0000"), linkAndAllocate(actorId, "10000005", "RACE0001")]);
  assert.deepEqual(results.map((r) => r.allocationStatus).sort(), ["ALLOCATED", "UNASSIGNED"]);
  assert.ok(results.every((r) => r.participant.checkedIn));
  const room = await RoomModel.findOne({ number: "H1" }).lean();
  assert.equal(room?.slots.filter((slot) => slot.teamId).length, 1);
  assert.equal(room?.available, 3);
});

test("a card cannot be linked to two participants at once", { skip: !enabled }, async () => {
  const teams = await TeamModel.create([{ unstopId: "U0000004", name: "C", world: "HARDWARE" }, { unstopId: "U0000005", name: "D", world: "HARDWARE" }]);
  await ParticipantModel.create(teams.map((team, i) => ({ teamId: team._id, name: `C${i}`, email: `card${i}@example.test`, college: "Other", role: "LEADER" as const, rsvpCode: `CARD000${i}` })));
  await CardModel.create({ code: "10000006" });
  const outcomes = await Promise.allSettled([linkAndAllocate(actorId, "10000006", "CARD0000"), linkAndAllocate(actorId, "10000006", "CARD0001")]);
  assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(outcomes.filter((r) => r.status === "rejected").length, 1);
  assert.equal(await ParticipantModel.countDocuments({ qrCode: "10000006" }), 1);
});
