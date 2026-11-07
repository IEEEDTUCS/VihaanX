import { writeFile } from "node:fs/promises";
import path from "node:path";

import mongoose from "mongoose";

import { DATABASE_NAMES } from "../config/constants";
import type { ParticipantRole } from "../config/constants";
import { connectDatabase, disconnectDatabase } from "../config/database";
import { env } from "../config/env";
import { ActivityModel } from "../models/activity.model";
import { AdminModel } from "../models/admin.model";
import { CardModel } from "../models/card.model";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import { TeamModel } from "../models/team.model";
import { createAdmin } from "../services/admin.service";
import { spacesTakenByRoom } from "../services/room.service";
import { signAccessToken } from "../utils/token";
import { confirmTarget } from "./confirmTarget";
import {
  SEED_LOAD_TEST_USAGE,
  parseSeedLoadTestOptions,
} from "./loadTestHelpers";

const FIRST = [
  "Aarav",
  "Diya",
  "Kabir",
  "Meera",
  "Rohan",
  "Ishaan",
  "Nisha",
  "Vikram",
  "Ananya",
  "Arjun",
  "Saanvi",
  "Reyansh",
  "Aditi",
  "Kiara",
  "Dhruv",
  "Myra",
];

const LAST = [
  "Sharma",
  "Verma",
  "Singh",
  "Iyer",
  "Gupta",
  "Rao",
  "Shah",
  "Nair",
  "Mehta",
  "Bose",
  "Kapoor",
  "Reddy",
];

const RESERVED_TEAMS = 8;
const VOLUNTEERS = 5;
const VOLUNTEER_PASSWORD = "a-long-load-test-password";

const pick = <T>(list: T[], index: number) => list[index % list.length] as T;

const code = (index: number) => String(10_000_000 + index);

const rsvp = (index: number) =>
  `LT${String(index).padStart(6, "0")}`.slice(0, 8);

const commitShas = async (repoUrl: string, wanted: number) => {
  const match = /github\.com\/([^/]+)\/([^/.]+)/.exec(repoUrl);

  if (!match) throw new Error(`--repo is not a GitHub URL: ${repoUrl}`);

  const [, owner, repo] = match;
  const shas: string[] = [];

  for (let page = 1; shas.length < wanted && page <= 4; page += 1) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`,
      {
        headers: {
          authorization: `Bearer ${env.GITHUB_TOKEN}`,
          accept: "application/vnd.github+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `GitHub answered ${response.status} listing commits for ${owner}/${repo}`,
      );
    }

    const body = (await response.json()) as { sha: string }[];

    if (body.length === 0) break;

    shas.push(...body.map((entry) => entry.sha));
  }

  if (shas.length === 0) throw new Error(`${repoUrl} has no commits`);

  return shas.slice(0, wanted);
};

const main = async () => {
  const options = parseSeedLoadTestOptions(process.argv.slice(2));

  if (typeof options === "string") {
    console.error(options);
    console.error(`\n${SEED_LOAD_TEST_USAGE}`);
    process.exitCode = 1;
    return;
  }

  if (env.NODE_ENV !== "test") {
    console.error(
      `This script only ever seeds ${DATABASE_NAMES.test}. Re-run it with ` +
        "NODE_ENV=test.",
    );
    process.exitCode = 1;
    return;
  }

  if (!(await confirmTarget({ assumeYes: options.assumeYes }))) {
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  try {
    if (mongoose.connection.name !== DATABASE_NAMES.test) {
      throw new Error(
        `Refusing to seed ${mongoose.connection.name}; only ` +
          `${DATABASE_NAMES.test} is allowed`,
      );
    }

    const shas = options.repoUrl
      ? await commitShas(options.repoUrl, options.teams)
      : [];

    await Promise.all([
      ActivityModel.deleteMany({}),
      AdminModel.deleteMany({}),
      CardModel.deleteMany({}),
      ParticipantModel.deleteMany({}),
      RoomModel.deleteMany({}),
      TeamModel.deleteMany({}),
    ]);

    const rooms = Array.from({ length: 20 }, (_, index) => ({
      number: `L${100 + index}`,
      capacity: 60,
      available: 60,
      hardware: index >= 16,
    }));

    await RoomModel.insertMany(rooms);

    const teams = Array.from({ length: options.teams }, (_, index) => ({
      unstopId: `UL${String(index).padStart(6, "0")}`,
      name: `Load Team ${index}`,
      world: index % 5 === 4 ? "HARDWARE" : "SOFTWARE",
      ...(options.repoUrl
        ? {
            project: {
              tracks: index % 5 === 4 ? ["h1"] : ["s1"],
              description: "A load-test project",
              repoUrl: options.repoUrl,
              imageUrl: null,
              submittedAt: new Date(),
              autoStatus: "VERIFIED",
              autoFlags: [],
              autoNotes: [],
            },
          }
        : {}),
    }));

    const insertedTeams = await TeamModel.insertMany(teams);

    let seq = 0;
    const participantDocs: Record<string, unknown>[] = [];
    const cardCodes: string[] = [];

    insertedTeams.forEach((team, teamIndex) => {
      const size = 3 + (teamIndex % 2);
      const reserved = teamIndex >= insertedTeams.length - RESERVED_TEAMS;

      for (let member = 0; member < size; member += 1) {
        const qrCode = code(seq);
        cardCodes.push(qrCode);

        participantDocs.push({
          teamId: team._id,
          name: `${pick(FIRST, seq)} ${pick(LAST, teamIndex)}`,
          email: `load.${seq}@example.com`,
          college: "Delhi Technological University",
          role: member === 0 ? "LEADER" : "MEMBER",
          phone: member === 0 ? "+919800000000" : null,
          rsvpCode: rsvp(seq),
          qrCode,
          checkedIn: !reserved,
          checkedInAt: reserved ? null : new Date(),
          mealsTaken: [],
        });

        seq += 1;
      }
    });

    await CardModel.insertMany(cardCodes.map((value) => ({ code: value })));

    const insertedParticipants =
      await ParticipantModel.insertMany(participantDocs);

    const checkedInTeams = insertedTeams.slice(
      0,
      insertedTeams.length - RESERVED_TEAMS,
    );

    const perRoom = Math.ceil(checkedInTeams.length / rooms.length);

    await Promise.all(
      checkedInTeams.map((team, index) => {
        const room = rooms[Math.floor(index / perRoom)] ?? rooms[0];
        return TeamModel.updateOne(
          { _id: team._id },
          { $set: { room: room?.number ?? null } },
        );
      }),
    );

    const taken = await spacesTakenByRoom();

    await Promise.all(
      rooms.map((room) =>
        RoomModel.updateOne(
          { number: room.number },
          {
            $set: {
              available: Math.max(
                room.capacity - (taken.get(room.number) ?? 0),
                0,
              ),
            },
          },
        ),
      ),
    );

    const volunteers = [];

    for (let index = 0; index < VOLUNTEERS; index += 1) {
      const admin = await createAdmin(
        `loadvol${index}`,
        VOLUNTEER_PASSWORD,
        "VOLUNTEER",
      );

      volunteers.push({
        id: admin.id,
        username: admin.username,
        token: signAccessToken({
          sub: admin.id,
          kind: "admin",
          role: "VOLUNTEER",
          ver: 0,
        }),
      });
    }

    const superAdmin = await createAdmin(
      "loadsuper",
      VOLUNTEER_PASSWORD,
      "SUPER_ADMIN",
    );

    const participants = insertedParticipants.map((row) => {
      const role = row.role as ParticipantRole;

      return {
        id: String(row._id),
        teamId: String(row.teamId),
        role,
        checkedIn: row.checkedIn,
        cardCode: row.qrCode,
        token: signAccessToken({
          sub: String(row._id),
          kind: "participant",
          role,
          ver: 0,
        }),
      };
    });

    const fixture = {
      database: mongoose.connection.name,
      createdAt: new Date().toISOString(),
      repoUrl: options.repoUrl,
      teams: insertedTeams.map((team, index) => ({
        id: String(team._id),
        unstopId: team.unstopId,
        world: team.world,
        commitUrl:
          options.repoUrl && shas[index]
            ? `${options.repoUrl.replace(/\.git$/, "")}/commit/${shas[index]}`
            : null,
      })),
      participants,
      volunteers,
      superAdmin: {
        id: superAdmin.id,
        username: superAdmin.username,
        token: signAccessToken({
          sub: superAdmin.id,
          kind: "admin",
          role: "SUPER_ADMIN",
          ver: 0,
        }),
      },
    };

    const outPath = path.isAbsolute(options.outPath)
      ? options.outPath
      : path.join(process.cwd(), "exports", options.outPath);

    await writeFile(outPath, JSON.stringify(fixture, null, 2), "utf8");

    const leaders = participants.filter((row) => row.role === "LEADER").length;
    const unchecked = participants.filter((row) => !row.checkedIn).length;

    console.log("\nLoad fixture summary");
    console.log(`  database:      ${mongoose.connection.name}`);
    console.log(`  teams:         ${insertedTeams.length}`);
    console.log(`  participants:  ${participants.length} (${leaders} leaders)`);
    console.log(`  not checked in: ${unchecked} (for the check-in scenario)`);
    console.log(`  cards:         ${cardCodes.length}`);
    console.log(`  rooms:         ${rooms.length}`);
    console.log(`  volunteers:    ${volunteers.length} + 1 super admin`);
    console.log(
      `  project repo:  ${options.repoUrl ?? "(none: --repo unset)"}`,
    );
    console.log(`\nFixture: ${outPath}`);
    console.log(
      "It holds live tokens for fake accounts in the test database only.",
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
