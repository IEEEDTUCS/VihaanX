import { CHECKPOINT_ROUNDS } from "../config/constants";
import { connectDatabase, disconnectDatabase } from "../config/database";
import { TeamModel } from "../models/team.model";
import { emptyCheckpoint, emptyProject } from "../services/submission.service";
import { confirmTarget } from "./confirmTarget";

const USAGE =
  "Usage: npx tsx --env-file=.env src/scripts/backfillSubmissions.ts [--yes]";

const main = async () => {
  const args = process.argv.slice(2);
  const unknown = args.filter((arg) => arg !== "--yes");

  if (unknown.length > 0) {
    console.error(`Unknown argument: ${unknown[0]}`);
    console.error(`\n${USAGE}`);
    process.exitCode = 1;
    return;
  }

  if (!(await confirmTarget({ assumeYes: args.includes("--yes") }))) {
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  try {
    const projects = await TeamModel.updateMany(
      { project: { $exists: false } },
      { $set: { project: emptyProject() } },
    );

    const rounds: Record<number, number> = {};

    for (const round of CHECKPOINT_ROUNDS) {
      const added = await TeamModel.updateMany(
        { "checkpoints.round": { $ne: round } },
        { $push: { checkpoints: emptyCheckpoint(round) } },
      );

      rounds[round] = added.modifiedCount;
    }

    const teams = await TeamModel.countDocuments();

    console.log("\nSubmission backfill summary");
    console.log(`  teams:             ${teams}`);
    console.log(`  projects added:    ${projects.modifiedCount}`);

    for (const round of CHECKPOINT_ROUNDS) {
      console.log(`  round ${round} slots added: ${rounds[round] ?? 0}`);
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
