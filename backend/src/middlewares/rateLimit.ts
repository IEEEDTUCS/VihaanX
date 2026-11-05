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

const loginKey = (req: { ip?: string; body?: unknown }) => {
  const ip = ipKeyGenerator(req.ip ?? "");

  const body = req.body;
  const raw =
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    typeof (body as { username: unknown }).username === "string"
      ? (body as { username: string }).username
      : "";

  const username = raw
    .trim()
    .toLowerCase()
    .slice(0, LOGIN_RATE_LIMIT_KEY_MAX_LENGTH);

  return `${ip}:${username}`;
};

export const loginRateLimiter = rateLimit({
  windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
  limit: LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: loginKey,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
    code: ERROR_CODES.RATE_LIMITED,
  },
});
