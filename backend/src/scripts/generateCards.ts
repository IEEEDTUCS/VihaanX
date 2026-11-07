import { connectDatabase, disconnectDatabase } from "../config/database";
import { countCards, createCards } from "../services/card.service";
import { writeExport } from "../utils/csv";
import { confirmTarget } from "./confirmTarget";
import { GENERATE_CARDS_USAGE, parseGenerateCardsOptions } from "./cardHelpers";

const main = async () => {
  const options = parseGenerateCardsOptions(process.argv.slice(2));

  if (typeof options === "string") {
    console.error(options);
    console.error(`\n${GENERATE_CARDS_USAGE}`);
    process.exitCode = 1;
    return;
  }

  if (!(await confirmTarget({ assumeYes: options.assumeYes }))) {
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  try {
    const { created, retries } = await createCards(options.count);

    const written = await writeExport(options.outPath, [
      ["Code"],
      ...created.map((code) => [code]),
    ]);

    const total = await countCards();

    console.log("\nCard generation summary");
    console.log(`  requested:   ${options.count}`);
    console.log(`  created:     ${created.length}`);
    console.log(`  retries:     ${retries} (duplicate code regenerated)`);
    console.log(`  cards in DB: ${total}`);
    console.log(`\nPrint file: ${written}`);
    console.log(
      "Each code is a login credential until the event ends: " +
        "it is not committed, and the file belongs with the printer only.",
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
