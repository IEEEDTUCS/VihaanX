import type { RequestHandler } from "express";

import { ERROR_CODES } from "../config/constants";
import type { AuthKind } from "../config/constants";
import { getAuth } from "./authenticate";
import { ApiError } from "../utils/ApiError";

export const requireKind = (...kinds: AuthKind[]): RequestHandler => {
  return (req, _res, next) => {
    const auth = getAuth(req);

    if (!kinds.includes(auth.kind)) {
      throw new ApiError(
        403,
        "You are not allowed to do that",
        ERROR_CODES.FORBIDDEN,
      );
    }

    next();
  };
};
