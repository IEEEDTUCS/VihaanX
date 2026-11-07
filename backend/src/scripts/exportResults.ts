import { connectDatabase, disconnectDatabase } from "../config/database";
import { rankedTeamsForExport } from "../services/team.service";
import { writeExport } from "../utils/csv";
import { describeTarget } from "./confirmTarget";
import {
  EXPORT_RESULTS_USAGE,
  parseExportResultsOptions,
} from "./exportHelpers";

const main = async () => {
  const options = parseExportResultsOptions(process.argv.slice(2));

  if (typeof options === "string") {
    console.error(options);
    console.error(`\n${EXPORT_RESULTS_USAGE}`);
    process.exitCode = 1;
    return;
  }

  describeTarget();

  await connectDatabase();

  try {
    const { header, rows } = await rankedTeamsForExport();

    const written = await writeExport(options.outPath, [header, ...rows], {
      bom: true,
    });

    console.log("\nResults export summary");
    console.log(`  teams written: ${rows.length}`);
    console.log("  order:         points desc, stars desc, name");
    console.log(`\nResults CSV: ${written}`);
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
