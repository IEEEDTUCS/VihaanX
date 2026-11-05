import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { ERROR_CODES } from "../config/constants";
import { ApiError } from "../utils/ApiError";

type ValidationSchemas = {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
};

const describe = (part: string, error: unknown) => {
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

export const validate = (schemas: ValidationSchemas): RequestHandler => {
  return (req, _res, next) => {
    const validated: { params?: unknown; query?: unknown; body?: unknown } = {};

    for (const part of ["params", "query", "body"] as const) {
      const schema = schemas[part];
      if (!schema) continue;

      // Express 5 makes req.query a read-only getter, so parsed input goes on
      // req.validated instead of being written back onto the request.
      const result = schema.safeParse(req[part]);
      if (!result.success) {
        throw new ApiError(
          400,
          describe(part, result.error),
          ERROR_CODES.VALIDATION_ERROR,
        );
      }
      validated[part] = result.data;
    }

    req.validated = validated;
    next();
  };
};
