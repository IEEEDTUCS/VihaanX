import type { ColumnSpec } from "../utils/csv";

export type SeedRoomsOptions = {
  csvPath: string;
  assumeYes: boolean;
};

export const SEED_ROOMS_USAGE = `Usage:
  npx tsx --env-file=.env src/scripts/seedRooms.ts <rooms.csv> [--yes]

Columns: number, capacity, hardware (true/false, blank means false).
Rooms are matched by number and the file is the source of truth, so a
re-run also recomputes each room's free space from the teams already in it.
tests/fixtures/rooms-dev.csv is last year's list, for development only.`;

export const ROOM_COLUMNS: ColumnSpec = {
  number: { headers: ["number", "room", "room number"], required: true },
  capacity: { headers: ["capacity", "seats"], required: true },
  hardware: { headers: ["hardware", "hardware only"], required: false },
};

export const parseSeedRoomsOptions = (
  argv: string[],
): SeedRoomsOptions | string => {
  let csvPath: string | null = null;
  let assumeYes = false;

  for (const argument of argv) {
    if (argument === "--yes") {
      assumeYes = true;
      continue;
    }

    if (argument.startsWith("--")) {
      return `Unknown option: ${argument}`;
    }

    if (csvPath !== null) return "Pass exactly one CSV path.";

    csvPath = argument;
  }

  if (csvPath === null) return "Pass the path to the rooms CSV.";

  return { csvPath, assumeYes };
};
