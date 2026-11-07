import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { parseOrThrow } from "../utils/parseInput";

type ValidationSchemas = {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
};

export const validate = (schemas: ValidationSchemas): RequestHandler => {
  return (req, _res, next) => {
    const validated: { params?: unknown; query?: unknown; body?: unknown } = {};

    for (const part of ["params", "query", "body"] as const) {
      const schema = schemas[part];
      if (!schema) continue;

      // Express 5 makes req.query a read-only getter, so parsed input goes on
      // req.validated instead of being written back onto the request.
      validated[part] = parseOrThrow(part, schema, req[part]);
    }

    req.validated = validated;
    next();
  };
};
