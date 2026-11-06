import { connectDatabase, disconnectDatabase } from "../config/database";
import { TEAM_SHEET_COLUMNS } from "../config/unstop";
import { teamSheetRowSchema } from "../schemas/import.schema";
import { listAllTeams, setTeamCategories } from "../services/team.service";
import {
  cellReader,
  describeColumnMismatch,
  readCsv,
  resolveColumns,
} from "../utils/csv";
import { confirmTarget } from "./confirmTarget";

type Options = {
  csvPath: string;
  assumeYes: boolean;
};

const USAGE = `Usage:
  npx tsx --env-file=.env src/scripts/importTeamDetails.ts <csv> [--yes]

The sheet carries prize categories only. A team's world comes from
importUnstop.ts, which is run once per Unstop export.`;

const parseOptions = (argv: string[]): Options | string => {
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

  if (csvPath === null) return "Pass the path to the filled team sheet.";

  return { csvPath, assumeYes };
};

const main = async () => {
  const options = parseOptions(process.argv.slice(2));

  if (typeof options === "string") {
    console.error(options);
    console.error(`\n${USAGE}`);
    process.exitCode = 1;
    return;
  }

  const table = await readCsv(options.csvPath);
  const columns = resolveColumns(table.header, TEAM_SHEET_COLUMNS);

  if (columns.missing.length > 0) {
    console.error(
      describeColumnMismatch(TEAM_SHEET_COLUMNS, table.header, columns.missing),
    );
    process.exitCode = 1;
    return;
  }

  const cell = cellReader(columns.indexes);

  const updates = new Map<string, ("WOMEN" | "FRESHERS" | "IEEE")[]>();
  const skipped: string[] = [];
  const duplicates: string[] = [];

  table.rows.forEach((row, index) => {
    const line = index + 2;

    const parsed = teamSheetRowSchema.safeParse({
      teamId: cell(row, "teamId"),
      teamName: cell(row, "teamName"),
      categories: cell(row, "categories"),
    });

    if (!parsed.success) {
      const reasons = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "row"}: ${issue.message}`)
        .join("; ");
      skipped.push(`line ${line}: ${reasons}`);
      return;
    }

    if (updates.has(parsed.data.teamId)) {
      duplicates.push(`line ${line}: ${parsed.data.teamId} appears twice`);
      return;
    }

    updates.set(parsed.data.teamId, parsed.data.categories);
  });

  if (!(await confirmTarget({ assumeYes: options.assumeYes }))) {
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  try {
    const unknown: string[] = [];
    let updated = 0;

    for (const [unstopId, categories] of updates) {
      const result = await setTeamCategories(unstopId, categories);

      if (!result) {
        unknown.push(unstopId);
        continue;
      }

      updated += 1;
    }

    const teams = await listAllTeams();
    const missingFromSheet = teams.filter(
      (team) => !updates.has(team.unstopId),
    );

    console.log("\nTeam details summary");
    console.log(`  rows read:     ${table.rows.length}`);
    console.log(`  teams updated: ${updated}`);
    console.log(`  rows skipped:  ${skipped.length + duplicates.length}`);

    const section = (title: string, lines: string[]) => {
      if (lines.length === 0) return;
      console.log(`\n${title} (${lines.length})`);
      for (const line of lines) console.log(`  - ${line}`);
    };

    section("Invalid rows", skipped);
    section("Duplicate Team IDs in the sheet", duplicates);
    section("Unknown Team IDs (not in the database)", unknown);
    section(
      "Teams in the database missing from the sheet",
      missingFromSheet.map((team) => `${team.unstopId} ${team.name}`),
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
