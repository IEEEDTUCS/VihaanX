export type SeedLoadTestOptions = {
  teams: number;
  repoUrl: string | null;
  outPath: string;
  assumeYes: boolean;
};

export const SEED_LOAD_TEST_USAGE = `Usage:
  NODE_ENV=test npx tsx --env-file=.env src/scripts/seedLoadTest.ts \\
    [--teams 140] [--repo https://github.com/<owner>/<repo>] \\
    [--out load-fixture.json] [--yes]

Fills vihaanx-test with fake teams, participants, cards and rooms for a load
test, and writes the tokens the harness needs. It refuses any database other
than vihaanx-test. --repo adds a project repo and one commit URL per team,
read from that repo's history, so the checkpoint scenario makes real GitHub
calls. Wipe the database afterwards with: npm test`;

export const LOAD_TEST_USAGE = `Usage:
  npx tsx --env-file=.env src/scripts/loadTest.ts \\
    --base http://127.0.0.1:4000/api/v1 [--fixture load-fixture.json] \\
    [--only me,meals,checkin,checkpoints]

Drives the seeded fixture against a running server and reports requests/sec
and p50/p95/p99 per scenario. Seed it first with seedLoadTest.ts.`;

export type LoadTestOptions = {
  base: string;
  fixturePath: string;
  only: string[] | null;
};

const valueFlags = <const T extends readonly string[]>(
  argv: string[],
  flags: T,
  booleans: readonly string[] = [],
): Map<string, string> | string => {
  const values = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === undefined) continue;

    if (booleans.includes(argument)) {
      values.set(argument, "true");
      continue;
    }

    const flag = flags.find((candidate) => candidate === argument);

    if (!flag) return `Unknown option: ${argument}`;

    const value = argv[index + 1];

    if (value === undefined || value.startsWith("--")) {
      return `${flag} needs a value.`;
    }

    if (values.has(flag)) return `${flag} was passed twice.`;

    values.set(flag, value);
    index += 1;
  }

  return values;
};

export const parseSeedLoadTestOptions = (
  argv: string[],
): SeedLoadTestOptions | string => {
  const values = valueFlags(argv, ["--teams", "--repo", "--out"], ["--yes"]);

  if (typeof values === "string") return values;

  const rawTeams = values.get("--teams") ?? "140";
  const teams = Number(rawTeams);

  if (!Number.isInteger(teams) || teams < 1 || teams > 1000) {
    return `--teams must be a whole number from 1 to 1000, not "${rawTeams}".`;
  }

  return {
    teams,
    repoUrl: values.get("--repo") ?? null,
    outPath: values.get("--out") ?? "load-fixture.json",
    assumeYes: values.get("--yes") === "true",
  };
};

export const parseLoadTestOptions = (
  argv: string[],
): LoadTestOptions | string => {
  const values = valueFlags(argv, ["--base", "--fixture", "--only"]);

  if (typeof values === "string") return values;

  const base = values.get("--base");

  if (base === undefined) return "--base is required.";

  return {
    base: base.replace(/\/$/, ""),
    fixturePath: values.get("--fixture") ?? "load-fixture.json",
    only:
      values
        .get("--only")
        ?.split(",")
        .map((name) => name.trim()) ?? null,
  };
};

export const percentile = (sorted: number[], fraction: number) => {
  if (sorted.length === 0) return 0;

  const index = Math.min(
    sorted.length - 1,
    Math.ceil(fraction * sorted.length) - 1,
  );

  return sorted[Math.max(0, index)] ?? 0;
};
