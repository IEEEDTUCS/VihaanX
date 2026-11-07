import { connectDatabase, disconnectDatabase } from "../config/database";
import { TEAM_MAX_MEMBERS } from "../config/constants";
import { UNSTOP_COLUMNS } from "../config/unstop";
import { unstopRowSchema } from "../schemas/import.schema";
import {
  LeaderConflictError,
  TeamMoveError,
  listParticipantsForExport,
  upsertParticipant,
} from "../services/participant.service";
import {
  listAllTeams,
  teamCompositions,
  upsertTeam,
} from "../services/team.service";
import {
  cellReader,
  describeColumnMismatch,
  readCsv,
  resolveColumns,
  writeExport,
} from "../utils/csv";
import { confirmTarget } from "./confirmTarget";
import {
  UNSTOP_IMPORT_USAGE,
  leaderPhone,
  orderRowsForUpsert,
  parseUnstopOptions,
} from "./importHelpers";
import type { ValidRow } from "./importHelpers";

const main = async () => {
  const options = parseUnstopOptions(process.argv.slice(2));

  if (typeof options === "string") {
    console.error(options);
    console.error(`\n${UNSTOP_IMPORT_USAGE}`);
    process.exitCode = 1;
    return;
  }

  const table = await readCsv(options.csvPath);
  const columns = resolveColumns(table.header, UNSTOP_COLUMNS);

  if (columns.missing.length > 0) {
    console.error(
      describeColumnMismatch(UNSTOP_COLUMNS, table.header, columns.missing),
    );
    process.exitCode = 1;
    return;
  }

  const cell = cellReader(columns.indexes);

  const valid: ValidRow[] = [];
  const skipped: string[] = [];
  const invalidPhones: string[] = [];
  const duplicates: string[] = [];
  const moved: string[] = [];
  const seenEmails = new Set<string>();

  table.rows.forEach((row, index) => {
    const line = index + 2;

    const parsed = unstopRowSchema.safeParse({
      teamId: cell(row, "teamId"),
      teamName: cell(row, "teamName"),
      name: cell(row, "name"),
      email: cell(row, "email"),
      phone: cell(row, "phone"),
      college: cell(row, "college"),
      role: cell(row, "role"),
    });

    if (!parsed.success) {
      const reasons = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "row"}: ${issue.message}`)
        .join("; ");
      skipped.push(`line ${line}: ${reasons}`);
      return;
    }

    const { phone, problem } = leaderPhone(parsed.data.role, parsed.data.phone);

    if (problem !== null) {
      const shown = problem === "blank" ? "blank" : `"${parsed.data.phone}"`;

      invalidPhones.push(
        `line ${line}: ${parsed.data.teamId} ${parsed.data.name} ` +
          `(${shown}) stored as null`,
      );
    }

    if (seenEmails.has(parsed.data.email)) {
      duplicates.push(
        `line ${line}: ${parsed.data.email} appears twice in this file`,
      );
      return;
    }

    seenEmails.add(parsed.data.email);

    valid.push({
      line,
      teamId: parsed.data.teamId,
      teamName: parsed.data.teamName,
      name: parsed.data.name,
      email: parsed.data.email,
      college: parsed.data.college,
      role: parsed.data.role,
      phone,
    });
  });

  if (!(await confirmTarget({ assumeYes: options.assumeYes }))) {
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  const counts = {
    teamsCreated: 0,
    teamsUpdated: 0,
    participantsCreated: 0,
    participantsUpdated: 0,
  };

  try {
    const byTeam = new Map<string, ValidRow[]>();

    for (const row of valid) {
      const rows = byTeam.get(row.teamId);
      if (rows) {
        rows.push(row);
      } else {
        byTeam.set(row.teamId, [row]);
      }
    }

    for (const [unstopId, rows] of byTeam) {
      const leaderRow = rows.find((row) => row.role === "LEADER");
      const teamName = (leaderRow ?? rows[0])?.teamName ?? unstopId;

      const team = await upsertTeam({
        unstopId,
        name: teamName,
        world: options.world,
      });

      if (team.created) counts.teamsCreated += 1;
      else counts.teamsUpdated += 1;

      const ordered = orderRowsForUpsert(rows);

      for (const row of ordered) {
        try {
          const participant = await upsertParticipant({
            teamId: team.id,
            name: row.name,
            email: row.email,
            college: row.college,
            role: row.role,
            phone: row.phone,
            allowMove: options.allowMove,
          });

          if (participant.created) counts.participantsCreated += 1;
          else counts.participantsUpdated += 1;

          if (participant.movedFrom !== null) {
            moved.push(
              `line ${row.line}: ${row.email} moved from team ` +
                `${participant.movedFrom} to ${unstopId}`,
            );
          }
        } catch (error) {
          if (error instanceof LeaderConflictError) {
            skipped.push(
              `line ${row.line}: ${unstopId} already has a different leader; ` +
                `${row.email} not imported as LEADER`,
            );
            continue;
          }
          if (error instanceof TeamMoveError) {
            skipped.push(`line ${row.line}: ${error.message}`);
            continue;
          }
          throw error;
        }
      }
    }

    const compositions = await teamCompositions();

    const wrongLeaderCount = compositions.filter((team) => team.leaders !== 1);
    const oversized = compositions.filter(
      (team) => team.members > TEAM_MAX_MEMBERS,
    );

    console.log("\nImport summary");
    console.log(`  world:        ${options.world}`);
    console.log(`  rows read:    ${table.rows.length}`);
    console.log(
      `  teams:        ${counts.teamsCreated} created, ` +
        `${counts.teamsUpdated} updated`,
    );
    console.log(
      `  participants: ${counts.participantsCreated} created, ` +
        `${counts.participantsUpdated} updated`,
    );
    console.log(`  rows skipped: ${skipped.length + duplicates.length}`);

    const section = (title: string, lines: string[]) => {
      if (lines.length === 0) return;
      console.log(`\n${title} (${lines.length})`);
      for (const line of lines) console.log(`  - ${line}`);
    };

    section("Skipped rows", skipped);
    section("Duplicate emails in this file", duplicates);
    section("Participants moved between teams", moved);
    section("Invalid leader phones", invalidPhones);
    section(
      "Teams without exactly one leader",
      wrongLeaderCount.map(
        (team) =>
          `${team.unstopId} ${team.name}: ${team.leaders} leaders, ` +
          `${team.members} members`,
      ),
    );
    section(
      `Teams with more than ${TEAM_MAX_MEMBERS} members`,
      oversized.map(
        (team) => `${team.unstopId} ${team.name}: ${team.members} members`,
      ),
    );

    if (options.exportPath) {
      const participants = await listParticipantsForExport();
      const written = await writeExport(options.exportPath, [
        ["Name", "Email", "Team Name", "Role", "RSVP Code"],
        ...participants.map((row) => [
          row.name,
          row.email,
          row.teamName,
          row.role,
          row.rsvpCode,
        ]),
      ]);
      console.log(
        `\nMail-merge CSV: ${written} (${participants.length} participants)`,
      );
    }

    if (options.teamsTemplatePath) {
      const teams = await listAllTeams();
      const written = await writeExport(options.teamsTemplatePath, [
        ["Team ID", "Team Name", "Categories"],
        ...teams.map((team) => [team.unstopId, team.name, ""]),
      ]);
      console.log(`Teams template: ${written} (${teams.length} teams)`);
    }
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
