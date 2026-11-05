export const DATABASE_NAMES = {
  development: "vihaanx-dev",
  production: "vihaanx",
  test: "vihaanx-test",
} as const;

export const DATABASE_CONNECT_TIMEOUT_MS = 10_000;

export const API_ROOT = "/api";
export const API_PREFIX = `${API_ROOT}/v1`;

export const JSON_BODY_LIMIT = "100kb";

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 300;

export const SHUTDOWN_TIMEOUT_MS = 10_000;

export const ADMIN_ROLES = ["SUPER_ADMIN", "VOLUNTEER"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const AUTH_KINDS = ["admin", "participant"] as const;
export type AuthKind = (typeof AUTH_KINDS)[number];

export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  USERNAME_TAKEN: "USERNAME_TAKEN",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  RATE_LIMITED: "RATE_LIMITED",
} as const;
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const BCRYPT_COST = 10;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 32;

export const JWT_ALGORITHM = "HS256" as const;
export const ACCESS_TOKEN_EXPIRY_DEFAULT = "1h";
export const REFRESH_TOKEN_EXPIRY_DEFAULT = "2d";

export const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60_000;
export const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 10;
export const LOGIN_RATE_LIMIT_KEY_MAX_LENGTH = 64;

export const MAX_VOLUNTEERS_RETURNED = 200;
