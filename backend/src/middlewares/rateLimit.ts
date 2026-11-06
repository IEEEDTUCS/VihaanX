import { ipKeyGenerator, rateLimit } from "express-rate-limit";

import {
  ERROR_CODES,
  LOGIN_RATE_LIMIT_KEY_MAX_LENGTH,
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
  LOGIN_RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "../config/constants";

export const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please slow down",
    code: ERROR_CODES.RATE_LIMITED,
  },
});

const loginKeyFor =
  (field: "username" | "email") => (req: { ip?: string; body?: unknown }) => {
    const ip = ipKeyGenerator(req.ip ?? "");

    const body = req.body;
    const raw =
      typeof body === "object" &&
      body !== null &&
      field in body &&
      typeof (body as Record<string, unknown>)[field] === "string"
        ? ((body as Record<string, string>)[field] as string)
        : "";

    const identifier = raw
      .trim()
      .toLowerCase()
      .slice(0, LOGIN_RATE_LIMIT_KEY_MAX_LENGTH);

    return `${ip}:${identifier}`;
  };

const loginLimiter = (field: "username" | "email") =>
  rateLimit({
    windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
    limit: LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: loginKeyFor(field),
    message: {
      success: false,
      message: "Too many login attempts, please try again later",
      code: ERROR_CODES.RATE_LIMITED,
    },
  });

export const loginRateLimiter = loginLimiter("username");

export const participantLoginRateLimiter = loginLimiter("email");
