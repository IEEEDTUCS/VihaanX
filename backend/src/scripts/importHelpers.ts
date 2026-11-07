import { TEAM_WORLDS } from "../config/constants";
import type { ParticipantRole, TeamWorld } from "../config/constants";
import { UNSTOP_COLUMNS, UNSTOP_FLAG_FIELDS } from "../config/unstop";
import { normalisePhone } from "../utils/phone";

export type UnstopImportOptions = {
  csvPath: string;
  world: TeamWorld;
  assumeYes: boolean;
  allowMove: boolean;
  exportPath: string | null;
  teamsTemplatePath: string | null;
};

export type ValidRow = {
  line: number;
  teamId: string;
  teamName: string;
  name: string;
  email: string;
  college: string;
  role: "LEADER" | "MEMBER";
  phone: string | null;
};

export const UNSTOP_IMPORT_USAGE = `Usage:
  npx tsx --env-file=.env src/scripts/importUnstop.ts <csv> \\
    --world software|hardware [--yes] [--allow-move] [--export <path>] \\
    [--teams-template <path>]

Registration on Unstop is separate per world, so run this once per export
and pass the world that export belongs to. --world is required.

A participant already on another team is skipped and reported. Pass
--allow-move to move them to the team in this file instead.`;

const VALUE_FLAGS = ["--world", "--export", "--teams-template"] as const;

type ValueFlag = (typeof VALUE_FLAGS)[number];

export const parseUnstopOptions = (
  argv: string[],
): UnstopImportOptions | string => {
  let csvPath: string | null = null;
  let assumeYes = false;
  let allowMove = false;

  const values = new Map<ValueFlag, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === undefined) continue;

    if (argument === "--yes") {
      assumeYes = true;
      continue;
    }

    if (argument === "--allow-move") {
      allowMove = true;
      continue;
    }

    const flag = VALUE_FLAGS.find((candidate) => candidate === argument);

    if (flag) {
      const value = argv[index + 1];

      if (value === undefined || value.startsWith("--")) {
        return `${flag} needs a value.`;
      }

      if (values.has(flag)) return `${flag} was passed twice.`;

      values.set(flag, value);
      index += 1;
      continue;
    }

    if (argument.startsWith("--")) {
      return `Unknown option: ${argument}`;
    }

    if (csvPath !== null) return "Pass exactly one CSV path.";

    csvPath = argument;
  }

  if (csvPath === null) return "Pass the path to the Unstop CSV.";

  const world = values.get("--world");

  if (world === undefined) {
    return "--world is required (software or hardware).";
  }

  const resolvedWorld = TEAM_WORLDS.find(
    (candidate) => candidate === world.trim().toUpperCase(),
  );

  if (!resolvedWorld) {
    return `--world must be software or hardware, not "${world}".`;
  }

  return {
    csvPath,
    world: resolvedWorld,
    assumeYes,
    allowMove,
    exportPath: values.get("--export") ?? null,
    teamsTemplatePath: values.get("--teams-template") ?? null,
  };
};

export const orderRowsForUpsert = (rows: ValidRow[]) =>
  [...rows].sort((a, b) =>
    a.role === b.role ? 0 : a.role === "MEMBER" ? -1 : 1,
  );

export type FlagColumnState = "all" | "none" | "partial";

export type FlagColumnPresence = {
  state: FlagColumnState;
  missing: string[];
};

export const flagColumnPresence = (
  indexes: Record<string, number>,
): FlagColumnPresence => {
  const missing = UNSTOP_FLAG_FIELDS.filter(
    (field) => indexes[field] === undefined,
  ).map((field) => UNSTOP_COLUMNS[field].headers[0] ?? field);

  if (missing.length === 0) return { state: "all", missing };

  if (missing.length === UNSTOP_FLAG_FIELDS.length) {
    return { state: "none", missing };
  }

  return { state: "partial", missing };
};

export type LeaderPhoneProblem = "blank" | "unreadable";

export type LeaderPhoneResult = {
  phone: string | null;
  problem: LeaderPhoneProblem | null;
};

export const leaderPhone = (
  role: ParticipantRole,
  raw: string,
): LeaderPhoneResult => {
  if (role !== "LEADER") return { phone: null, problem: null };

  const phone = normalisePhone(raw);

  if (phone !== null) return { phone, problem: null };

  return {
    phone: null,
    problem: raw.trim().length === 0 ? "blank" : "unreadable",
  };
};
