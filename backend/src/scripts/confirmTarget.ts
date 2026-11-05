import readline from "node:readline/promises";

import { DATABASE_NAMES } from "../config/constants";
import { env } from "../config/env";

const clusterHost = () => {
  try {
    const { host } = new URL(env.MONGODB_URI);
    return host || "(host unknown)";
  } catch {
    return "(host unknown)";
  }
};

export type ConfirmOptions = {
  assumeYes: boolean;
};

export const confirmTarget = async ({ assumeYes }: ConfirmOptions) => {
  const database = DATABASE_NAMES[env.NODE_ENV];

  console.log(`Target: ${database} on ${clusterHost()}`);

  if (assumeYes) {
    console.log("Confirmed by --yes.");
    return true;
  }

  if (!process.stdin.isTTY) {
    console.error(
      "Refusing to write without confirmation. Re-run in a terminal, " +
        "or pass --yes if you are sure.",
    );
    return false;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = await rl.question('Type "yes" to continue: ');
    if (answer.trim() !== "yes") {
      console.error("Cancelled.");
      return false;
    }
    return true;
  } finally {
    rl.close();
  }
};
