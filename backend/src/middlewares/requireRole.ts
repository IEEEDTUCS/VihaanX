import type { RequestHandler } from "express";

import { ERROR_CODES } from "../config/constants";
import type { AuthRole } from "../config/constants";
import { getAuth } from "./authenticate";
import { ApiError } from "../utils/ApiError";

export const requireRole = (...roles: AuthRole[]): RequestHandler => {
  return (req, _res, next) => {
    const auth = getAuth(req);

    if (!roles.includes(auth.role)) {
      throw new ApiError(
        403,
        "You are not allowed to do that",
        ERROR_CODES.FORBIDDEN,
      );
    }

    next();
  };
};
