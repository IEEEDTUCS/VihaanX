import type { ZodType } from "zod";

import { ERROR_CODES } from "../config/constants";
import { ApiError } from "./ApiError";

export type InputPart = "params" | "query" | "body";

export const describeIssues = (part: InputPart, error: unknown) => {
  const issues =
    typeof error === "object" && error !== null && "issues" in error
      ? (error as { issues: { path: PropertyKey[]; message: string }[] }).issues
      : [];

  if (issues.length === 0) {
    return `${part} is invalid`;
  }

  return issues
    .map((issue) => {
      const path = issue.path.map(String).join(".");
      return path
        ? `${part}.${path}: ${issue.message}`
        : `${part}: ${issue.message}`;
    })
    .join("; ");
};

export const parseOrThrow = <T>(
  part: InputPart,
  schema: ZodType<T>,
  value: unknown,
): T => {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new ApiError(
      400,
      describeIssues(part, result.error),
      ERROR_CODES.VALIDATION_ERROR,
    );
  }

  return result.data;
};
