import assert from "node:assert/strict";
import test from "node:test";
import { selectAllocation } from "../../src/services/allocationPlanner";
import type { AllocationRoom } from "../../src/services/allocationPlanner";

const room = (overrides: Partial<AllocationRoom> = {}): AllocationRoom => ({
  id: "104", number: "104", enabled: true, small: true, hardware: false,
  teamCount: 0, peopleRemaining: null, colleges: [], slots: [
    { id: "1", label: "104-T1", row: "C2", available: true },
    { id: "2", label: "104-T2", row: "C2", available: true },
    { id: "3", label: "104-T3", row: "C3", available: true },
  ], ...overrides,
});
const request = { memberCount: 4, hardware: false, colleges: ["DTU"] };

test("larger teams get two slots in the same row", () => {
  assert.deepEqual(selectAllocation(request, [room()])?.slotLabels, ["104-T1", "104-T2"]);
  assert.equal(selectAllocation(request, [room({ slots: [room().slots[0]!, room().slots[2]!] })]), null);
});

test("single-slot teams preserve a possible pair", () => {
  assert.deepEqual(selectAllocation({ ...request, memberCount: 2 }, [room()])?.slotLabels, ["104-T3"]);
});

test("the 15 team preference takes priority over college proximity but is not a cap", () => {
  const full = room({ teamCount: 15, colleges: ["DTU"] });
  const other = room({ id: "201", number: "201", small: false });
  assert.equal(selectAllocation(request, [full, other])?.roomId, "201");
  assert.equal(selectAllocation(request, [full])?.exceedsSmallRoomPreference, true);
});

test("respects room compatibility, people capacity and validates roster", () => {
  assert.equal(selectAllocation(request, [room({ hardware: true })]), null);
  assert.equal(selectAllocation(request, [room({ peopleRemaining: 3 })]), null);
  assert.throws(() => selectAllocation({ ...request, memberCount: 0 }, [room()]), RangeError);
});

test("matches a mixed team's college and keeps inputs unchanged", () => {
  const matching = room({ id: "201", number: "201", colleges: ["  DTU  "] });
  const rooms = [room(), matching];
  const before = structuredClone(rooms);
  assert.equal(selectAllocation({ ...request, colleges: ["other", "dtu"] }, rooms)?.roomId, "201");
  assert.deepEqual(rooms, before);
});
