import { connectDatabase, disconnectDatabase } from "../config/database";
import { roomRowSchema } from "../schemas/room.schema";
import {
  listAllRoomNumbers,
  spacesTakenByRoom,
  upsertRoom,
} from "../services/room.service";
import {
  cellReader,
  describeColumnMismatch,
  readCsv,
  resolveColumns,
} from "../utils/csv";
import { confirmTarget } from "./confirmTarget";
import {
  ROOM_COLUMNS,
  SEED_ROOMS_USAGE,
  parseSeedRoomsOptions,
} from "./roomHelpers";

type ValidRoom = {
  line: number;
  number: string;
  capacity: number;
  hardware: boolean;
};

const main = async () => {
  const options = parseSeedRoomsOptions(process.argv.slice(2));

  if (typeof options === "string") {
    console.error(options);
    console.error(`\n${SEED_ROOMS_USAGE}`);
    process.exitCode = 1;
    return;
  }

  const table = await readCsv(options.csvPath);
  const columns = resolveColumns(table.header, ROOM_COLUMNS);

  if (columns.missing.length > 0) {
    console.error(
      describeColumnMismatch(ROOM_COLUMNS, table.header, columns.missing),
    );
    process.exitCode = 1;
    return;
  }

  const cell = cellReader(columns.indexes);

  const valid: ValidRoom[] = [];
  const skipped: string[] = [];
  const seen = new Set<string>();

  table.rows.forEach((row, index) => {
    const line = index + 2;

    const parsed = roomRowSchema.safeParse({
      number: cell(row, "number"),
      capacity: cell(row, "capacity"),
      hardware: cell(row, "hardware"),
    });

    if (!parsed.success) {
      const reasons = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "row"}: ${issue.message}`)
        .join("; ");
      skipped.push(`line ${line}: ${reasons}`);
      return;
    }

    if (seen.has(parsed.data.number)) {
      skipped.push(
        `line ${line}: room ${parsed.data.number} appears twice in the file`,
      );
      return;
    }

    seen.add(parsed.data.number);
    valid.push({ line, ...parsed.data });
  });

  if (!(await confirmTarget({ assumeYes: options.assumeYes }))) {
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  const counts = { created: 0, updated: 0 };

  try {
    const taken = await spacesTakenByRoom();

    for (const room of valid) {
      const occupied = taken.get(room.number) ?? 0;
      const available = room.capacity - occupied;

      if (available < 0) {
        skipped.push(
          `line ${room.line}: room ${room.number} already holds ${occupied} ` +
            `people, so a capacity of ${room.capacity} was not written`,
        );
        continue;
      }

      const result = await upsertRoom({
        number: room.number,
        capacity: room.capacity,
        available,
        hardware: room.hardware,
      });

      if (result.created) counts.created += 1;
      else counts.updated += 1;
    }

    const inFile = new Set(valid.map((room) => room.number));
    const missing = (await listAllRoomNumbers()).filter(
      (number) => !inFile.has(number),
    );

    const totals = valid.reduce((sum, room) => sum + room.capacity, 0);

    console.log("\nRoom seeding summary");
    console.log(`  rows read:      ${table.rows.length}`);
    console.log(
      `  rooms:          ${counts.created} created, ` +
        `${counts.updated} updated`,
    );
    console.log(`  total capacity: ${totals} (rooms in the file)`);
    console.log(`  rows skipped:   ${skipped.length}`);

    const section = (title: string, lines: string[]) => {
      if (lines.length === 0) return;
      console.log(`\n${title} (${lines.length})`);
      for (const line of lines) console.log(`  - ${line}`);
    };

    section("Skipped rows", skipped);
    section(
      "Rooms in the database but not in this file (left untouched)",
      missing,
    );
  } finally {
    await disconnectDatabase();
  }
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  process.exit(process.exitCode ?? 0);
}
