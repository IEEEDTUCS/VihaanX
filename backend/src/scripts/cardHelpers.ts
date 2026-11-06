import { CARD_GENERATE_MAX_COUNT } from "../config/constants";

export type GenerateCardsOptions = {
  count: number;
  outPath: string;
  assumeYes: boolean;
};

export const GENERATE_CARDS_USAGE = `Usage:
  npx tsx --env-file=.env src/scripts/generateCards.ts \\
    --count <n> --out cards.csv [--yes]

Inserts <n> new 8-digit card codes and writes only the new ones to the CSV.
Re-run it to add more; existing codes are never touched or reprinted.
A relative --out path lands in backend/exports/, which is git-ignored.`;

const VALUE_FLAGS = ["--count", "--out"] as const;

type ValueFlag = (typeof VALUE_FLAGS)[number];

export const parseGenerateCardsOptions = (
  argv: string[],
): GenerateCardsOptions | string => {
  let assumeYes = false;

  const values = new Map<ValueFlag, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === undefined) continue;

    if (argument === "--yes") {
      assumeYes = true;
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

    return `Unknown argument: ${argument}`;
  }

  const rawCount = values.get("--count");

  if (rawCount === undefined) return "--count is required.";

  if (!/^\d+$/.test(rawCount.trim())) {
    return `--count must be a whole number, not "${rawCount}".`;
  }

  const count = Number(rawCount.trim());

  if (count < 1 || count > CARD_GENERATE_MAX_COUNT) {
    return `--count must be between 1 and ${CARD_GENERATE_MAX_COUNT}.`;
  }

  const outPath = values.get("--out");

  if (outPath === undefined) return "--out is required.";

  return { count, outPath, assumeYes };
};
