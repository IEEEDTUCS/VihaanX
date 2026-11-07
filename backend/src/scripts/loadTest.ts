import { readFile } from "node:fs/promises";
import path from "node:path";

import mongoose from "mongoose";

import { connectDatabase, disconnectDatabase } from "../config/database";
import { MEAL_SLOTS } from "../config/event";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import { TeamModel } from "../models/team.model";
import { teamSpaces } from "../services/room.service";
import {
  LOAD_TEST_USAGE,
  parseLoadTestOptions,
  percentile,
} from "./loadTestHelpers";

type Fixture = {
  database: string;
  repoUrl: string | null;
  teams: {
    id: string;
    unstopId: string;
    world: string;
    commitUrl: string | null;
  }[];
  participants: {
    id: string;
    teamId: string;
    role: string;
    checkedIn: boolean;
    cardCode: string;
    token: string;
  }[];
  volunteers: { id: string; username: string; token: string }[];
  superAdmin: { id: string; token: string };
};

type Outcome = { ms: number; status: number; error?: string };

const run = async (
  label: string,
  concurrency: number,
  jobs: (() => Promise<Response>)[],
) => {
  const outcomes: Outcome[] = [];
  let next = 0;
  const startedAt = Date.now();

  const worker = async () => {
    for (;;) {
      const index = next;
      next += 1;

      const job = jobs[index];
      if (job === undefined) return;

      const began = Date.now();

      try {
        const response = await job();
        await response.text();
        outcomes.push({ ms: Date.now() - began, status: response.status });
      } catch (error) {
        outcomes.push({
          ms: Date.now() - began,
          status: 0,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, jobs.length) }, worker),
  );

  const elapsed = (Date.now() - startedAt) / 1000;
  const sorted = outcomes.map((row) => row.ms).sort((a, b) => a - b);

  const byStatus = new Map<number, number>();
  for (const row of outcomes) {
    byStatus.set(row.status, (byStatus.get(row.status) ?? 0) + 1);
  }

  const p95 = percentile(sorted, 0.95);

  return {
    label,
    concurrency,
    requests: outcomes.length,
    seconds: elapsed,
    perSecond: elapsed > 0 ? outcomes.length / elapsed : outcomes.length,
    p50: percentile(sorted, 0.5),
    p95,
    p99: percentile(sorted, 0.99),
    max: sorted[sorted.length - 1] ?? 0,
    statuses: [...byStatus.entries()].sort((a, b) => a[0] - b[0]),
    errors: outcomes.filter((row) => row.error).slice(0, 5),
    slow: p95 > 500,
  };
};

const report = (result: Awaited<ReturnType<typeof run>>) => {
  const statuses = result.statuses
    .map(([status, count]) => `${status === 0 ? "network" : status}:${count}`)
    .join(" ");

  console.log(`\n${result.label}`);
  console.log(
    `  requests:   ${result.requests} at ${result.concurrency} concurrent ` +
      `in ${result.seconds.toFixed(2)}s`,
  );
  console.log(`  throughput: ${result.perSecond.toFixed(1)} req/s`);
  console.log(
    `  latency:    p50 ${result.p50}ms  p95 ${result.p95}ms  ` +
      `p99 ${result.p99}ms  max ${result.max}ms` +
      (result.slow ? "   <-- p95 over 500ms" : ""),
  );
  console.log(`  statuses:   ${statuses}`);

  for (const failure of result.errors) {
    console.log(`  error:      ${failure.error}`);
  }
};

const verifyInvariants = async (expectedDatabase: string) => {
  await connectDatabase();

  const problems: string[] = [];

  try {
    if (mongoose.connection.name !== expectedDatabase) {
      throw new Error(
        `The fixture was seeded against ${expectedDatabase} but this process ` +
          `connected to ${mongoose.connection.name}. Re-run with ` +
          `NODE_ENV set to the same value the seed used.`,
      );
    }

    const rooms = await RoomModel.find().lean();
    const teams = await TeamModel.find({ room: { $ne: null } }).lean();
    const counts = await ParticipantModel.aggregate<{
      _id: unknown;
      members: number;
    }>([{ $group: { _id: "$teamId", members: { $sum: 1 } } }]);

    const membersOf = new Map(
      counts.map((row) => [String(row._id), row.members]),
    );

    for (const room of rooms) {
      if (room.available < 0) {
        problems.push(
          `room ${room.number}: available is ${room.available}, below zero`,
        );
      }

      if (room.available > room.capacity) {
        problems.push(
          `room ${room.number}: available ${room.available} exceeds ` +
            `capacity ${room.capacity}`,
        );
      }
    }

    const occupied = new Map<string, number>();

    for (const team of teams) {
      if (team.room === null) continue;

      const spaces = teamSpaces(membersOf.get(String(team._id)) ?? 0);
      occupied.set(team.room, (occupied.get(team.room) ?? 0) + spaces);
    }

    for (const room of rooms) {
      const taken = occupied.get(room.number) ?? 0;
      const expected = room.capacity - taken;

      if (room.available !== expected) {
        problems.push(
          `room ${room.number}: available is ${room.available} but the teams ` +
            `in it occupy ${taken} of ${room.capacity}, so it should be ` +
            `${expected}`,
        );
      }
    }

    const perTeam = new Map<string, Set<string>>();

    for (const team of teams) {
      const key = String(team._id);
      const seen = perTeam.get(key) ?? new Set<string>();
      if (team.room !== null) seen.add(team.room);
      perTeam.set(key, seen);
    }

    for (const [team, allocated] of perTeam) {
      if (allocated.size > 1) {
        problems.push(
          `team ${team} holds ${allocated.size} rooms: ` +
            `${[...allocated].join(", ")}`,
        );
      }
    }

    console.log("\nInvariants after the run");
    console.log(`  rooms checked:          ${rooms.length}`);
    console.log(`  teams with a room:      ${teams.length}`);
    console.log(
      `  available never negative: ${
        rooms.every((room) => room.available >= 0) ? "yes" : "NO"
      }`,
    );
    console.log(
      `  no team holds two rooms:  ${
        [...perTeam.values()].every((set) => set.size <= 1) ? "yes" : "NO"
      }`,
    );
    console.log(
      `  free space matches the teams in each room: ${
        problems.length === 0 ? "yes" : "NO"
      }`,
    );

    for (const problem of problems) console.log(`  PROBLEM: ${problem}`);
  } finally {
    await disconnectDatabase();
  }

  return problems.length;
};

const main = async () => {
  const options = parseLoadTestOptions(process.argv.slice(2));

  if (typeof options === "string") {
    console.error(options);
    console.error(`\n${LOAD_TEST_USAGE}`);
    process.exitCode = 1;
    return;
  }

  const fixturePath = path.isAbsolute(options.fixturePath)
    ? options.fixturePath
    : path.join(process.cwd(), "exports", options.fixturePath);

  const fixture = JSON.parse(await readFile(fixturePath, "utf8")) as Fixture;

  const wants = (name: string) =>
    options.only === null || options.only.includes(name);

  const get = (url: string, token: string) => () =>
    fetch(`${options.base}${url}`, {
      headers: { authorization: `Bearer ${token}` },
    });

  const post = (url: string, token: string, body?: unknown) => () =>
    fetch(`${options.base}${url}`, {
      method: body === undefined ? "POST" : "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

  console.log(`Load test against ${options.base}`);
  console.log(`Fixture: ${fixturePath} (${fixture.database})`);

  const results: Awaited<ReturnType<typeof run>>[] = [];

  const checkedIn = fixture.participants.filter((row) => row.checkedIn);
  const pending = fixture.participants.filter((row) => !row.checkedIn);

  if (wants("me")) {
    const callers = checkedIn.slice(0, 50);
    const jobs = Array.from({ length: 500 }, (_, index) => {
      const caller = callers[index % callers.length];
      return get("/me", caller?.token ?? "");
    });

    results.push(await run("GET /me, 50 distinct participants", 50, jobs));
  }

  if (wants("meals")) {
    const slot = MEAL_SLOTS[0]?.id ?? "lunch-d1";
    const targets = checkedIn.slice(50, 70);
    const volunteers = fixture.volunteers;

    const jobs = targets.map((target, index) =>
      post(
        `/participants/${target.id}/meals/${slot}`,
        volunteers[index % volunteers.length]?.token ?? "",
      ),
    );

    results.push(
      await run("20 volunteers serving 20 different participants", 20, jobs),
    );
  }

  if (wants("checkin")) {
    const targets = pending.slice(0, 20);
    const volunteers = fixture.volunteers;

    const jobs = targets.map((target, index) =>
      post(
        `/participants/${target.id}/check-in`,
        volunteers[index % volunteers.length]?.token ?? "",
      ),
    );

    results.push(
      await run("20 concurrent check-ins, teammates included", 20, jobs),
    );
  }

  if (wants("checkpoints")) {
    const leaders = fixture.participants.filter((row) => row.role === "LEADER");

    const byTeam = new Map(fixture.teams.map((team) => [team.id, team]));

    const jobs = leaders
      .filter((leader) => {
        const team = byTeam.get(leader.teamId);
        return team?.world === "SOFTWARE" && team.commitUrl !== null;
      })
      .slice(0, 30)
      .map((leader) =>
        post("/me/team/checkpoints/1", leader.token, {
          commitUrl: byTeam.get(leader.teamId)?.commitUrl,
        }),
      );

    if (jobs.length === 0) {
      console.log(
        "\n30 concurrent checkpoint submissions\n  skipped: the fixture has " +
          "no project repo (seed with --repo)",
      );
    } else {
      results.push(
        await run(
          `${jobs.length} concurrent checkpoint submissions (real GitHub)`,
          30,
          jobs,
        ),
      );
    }
  }

  for (const result of results) report(result);

  const slow = results.filter((result) => result.slow);
  const failed = results.filter((result) =>
    result.statuses.some(([status]) => status === 0 || status >= 500),
  );

  const brokenInvariants = await verifyInvariants(fixture.database);

  console.log("\nSummary");
  console.log(`  scenarios:    ${results.length}`);
  console.log(`  broken invariants: ${brokenInvariants}`);
  console.log(`  p95 over 500ms: ${slow.length}`);
  console.log(`  with 5xx or network errors: ${failed.length}`);

  if (slow.length > 0) {
    console.log(`  slow: ${slow.map((result) => result.label).join("; ")}`);
  }
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
