export type ExportResultsOptions = {
  outPath: string;
};

export const DEFAULT_RESULTS_OUT = "results.csv";

export const EXPORT_RESULTS_USAGE = `Usage:
  npx tsx --env-file=.env src/scripts/exportResults.ts [--out <path>]

Writes every team ranked by points, then stars, then name. Read-only: it
touches nothing in the database, so there is no confirmation prompt, only the
target line above the summary. A relative --out path lands in
backend/exports/, which is git-ignored; the default is ${DEFAULT_RESULTS_OUT}.`;

const EXPORTS_PREFIX = /^(\.\/)?exports\//;

export const parseExportResultsOptions = (
  argv: string[],
): ExportResultsOptions | string => {
  let outPath: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === undefined) continue;

    if (argument === "--out") {
      const value = argv[index + 1];

      if (value === undefined || value.startsWith("--")) {
        return "--out needs a value.";
      }

      if (outPath !== null) return "--out was passed twice.";

      outPath = value;
      index += 1;
      continue;
    }

    return `Unknown argument: ${argument}`;
  }

  return {
    outPath: (outPath ?? DEFAULT_RESULTS_OUT).replace(EXPORTS_PREFIX, ""),
  };
};
