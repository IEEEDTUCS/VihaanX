import type { RequestHandler } from "express";

import { ERROR_CODES } from "../config/constants";
import { ApiError } from "../utils/ApiError";

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new ApiError(404, "Route not found", ERROR_CODES.NOT_FOUND));
};
