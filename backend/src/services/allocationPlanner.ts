/** A snapshot used to select a candidate. Claiming it must still be atomic. */
export type AllocationSlot = {
  id: string;
  label: string;
  row: string;
  available: boolean;
};

export type AllocationRoom = {
  id: string;
  number: string;
  enabled: boolean;
  small: boolean;
  hardware: boolean;
  teamCount: number;
  peopleRemaining: number | null;
  colleges: string[];
  slots: AllocationSlot[];
};

export type AllocationRequest = {
  memberCount: number;
  hardware: boolean;
  colleges: string[];
};

export type AllocationCandidate = {
  roomId: string;
  roomNumber: string;
  slotIds: string[];
  slotLabels: string[];
  exceedsSmallRoomPreference: boolean;
};

const compare = (a: string, b: string) => a.localeCompare(b, "en", { numeric: true });
const collegeKey = (value: string) => value.trim().toLocaleLowerCase("en").replace(/\s+/g, " ");

/** Selects a placement from a snapshot; it never mutates or reserves inventory. */
export const selectAllocation = (
  request: AllocationRequest,
  rooms: AllocationRoom[],
): AllocationCandidate | null => {
  if (!Number.isInteger(request.memberCount) || request.memberCount < 1 || request.memberCount > 4) {
    throw new RangeError("Team size must be between 1 and 4");
  }
  const slotCount = request.memberCount <= 2 ? 1 : 2;
  const colleges = new Set(request.colleges.map(collegeKey).filter(Boolean));
  const candidates: { result: AllocationCandidate; penalty: number; collegeMatch: boolean; pairsLeft: number }[] = [];

  for (const room of rooms) {
    if (!room.enabled || room.hardware !== request.hardware ||
      (room.peopleRemaining !== null && room.peopleRemaining < request.memberCount)) continue;
    const rows = new Map<string, AllocationSlot[]>();
    for (const slot of room.slots) {
      if (!slot.available || !slot.row.trim()) continue;
      const list = rows.get(slot.row) ?? [];
      list.push(slot);
      rows.set(slot.row, list);
    }
    const totalPairs = [...rows.values()].reduce((sum, slots) => sum + Math.floor(slots.length / 2), 0);
    for (const slots of rows.values()) {
      const sorted = [...slots].sort((a, b) => compare(a.label, b.label) || compare(a.id, b.id));
      for (let i = 0; i < sorted.length; i += 1) {
        const first = sorted[i]!;
        const choices = slotCount === 1 ? [null] : sorted.slice(i + 1);
        for (const second of choices) {
          const chosen = second ? [first, second] : [first];
          const pairsLeft = totalPairs - Math.floor(sorted.length / 2) + Math.floor((sorted.length - slotCount) / 2);
          candidates.push({
            result: { roomId: room.id, roomNumber: room.number, slotIds: chosen.map((s) => s.id), slotLabels: chosen.map((s) => s.label), exceedsSmallRoomPreference: room.small && room.teamCount >= 15 },
            penalty: room.small && room.teamCount >= 15 ? 1 : 0,
            collegeMatch: room.colleges.some((c) => colleges.has(collegeKey(c))),
            pairsLeft,
          });
        }
      }
    }
  }
  candidates.sort((a, b) => a.penalty - b.penalty || Number(b.collegeMatch) - Number(a.collegeMatch) ||
    b.pairsLeft - a.pairsLeft || compare(a.result.roomNumber, b.result.roomNumber) ||
    compare(a.result.slotLabels.join(","), b.result.slotLabels.join(",")) || compare(a.result.roomId, b.result.roomId));
  return candidates[0]?.result ?? null;
};
