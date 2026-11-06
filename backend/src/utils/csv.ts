import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

export const EXPORTS_DIRECTORY = path.resolve(
  import.meta.dirname,
  "../../exports",
);

export type CsvTable = {
  header: string[];
  rows: string[][];
};

export const readCsv = async (filePath: string): Promise<CsvTable> => {
  const text = await readFile(filePath, "utf8");

  let records: string[][];

  try {
    records = parse(text, {
      bom: true,
      skipEmptyLines: true,
      relaxColumnCount: true,
      trim: true,
    }) as string[][];
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${filePath} is not valid CSV: ${reason}. Nothing was written. ` +
        "Re-export it, or open it in a spreadsheet and save as CSV.",
    );
  }

  const [header, ...rows] = records;

  return {
    header: header ?? [],
    rows: rows.filter((row) => row.some((cell) => cell.length > 0)),
  };
};

const SPREADSHEET_FORMULA_START = /^[=+\-@\t\r]/;

export const defuseFormula = (value: string) =>
  SPREADSHEET_FORMULA_START.test(value) ? `'${value}` : value;

const quote = (value: string) =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export const toCsv = (rows: string[][]) =>
  `${rows
    .map((row) => row.map((cell) => quote(defuseFormula(cell))).join(","))
    .join("\r\n")}\r\n`;

export const resolveExportPath = (given: string) =>
  path.isAbsolute(given) ? given : path.join(EXPORTS_DIRECTORY, given);

export const writeExport = async (given: string, rows: string[][]) => {
  const target = resolveExportPath(given);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, toCsv(rows), "utf8");
  return target;
};

export type ColumnSpec = Record<
  string,
  { headers: string[]; required: boolean }
>;

export type ResolvedColumns = {
  indexes: Record<string, number>;
  missing: string[];
};

export const resolveColumns = (
  header: string[],
  spec: ColumnSpec,
): ResolvedColumns => {
  const normalised = header.map((cell) => cell.trim().toLowerCase());

  const indexes: Record<string, number> = {};
  const missing: string[] = [];

  for (const [field, { headers, required }] of Object.entries(spec)) {
    const index = headers
      .map((candidate) => normalised.indexOf(candidate.trim().toLowerCase()))
      .find((found) => found >= 0);

    if (index === undefined) {
      if (required) {
        missing.push(`${field}: one of ${headers.join(" | ")}`);
      }
      continue;
    }

    indexes[field] = index;
  }

  return { indexes, missing };
};

export const cellReader =
  (indexes: Record<string, number>) => (row: string[], field: string) => {
    const index = indexes[field];
    return index === undefined ? "" : (row[index] ?? "");
  };

export const describeColumnMismatch = (
  spec: ColumnSpec,
  header: string[],
  missing: string[],
) =>
  [
    "Required columns are missing; nothing was written.",
    "",
    "Missing:",
    ...missing.map((entry) => `  - ${entry}`),
    "",
    "Expected (first spelling is the one Unstop used last year):",
    ...Object.entries(spec).map(
      ([field, { headers, required }]) =>
        `  - ${field}${required ? "" : " (optional)"}: ${headers.join(" | ")}`,
    ),
    "",
    "Found:",
    ...(header.length > 0
      ? header.map((cell) => `  - ${cell}`)
      : ["  (no header row)"]),
  ].join("\n");
