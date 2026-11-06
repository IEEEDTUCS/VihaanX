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

export const PARTICIPANT_ROLES = ["LEADER", "MEMBER"] as const;
export type ParticipantRole = (typeof PARTICIPANT_ROLES)[number];

export type AuthRole = AdminRole | ParticipantRole;

export const AUTH_KINDS = ["admin", "participant"] as const;
export type AuthKind = (typeof AUTH_KINDS)[number];

export const TEAM_WORLDS = ["SOFTWARE", "HARDWARE"] as const;
export type TeamWorld = (typeof TEAM_WORLDS)[number];

export const TEAM_CATEGORIES = ["WOMEN", "FRESHERS", "IEEE"] as const;
export type TeamCategory = (typeof TEAM_CATEGORIES)[number];

export const ROOM_STATUSES = [
  "ALLOCATED",
  "ALREADY_HAD_ROOM",
  "NO_ROOM_AVAILABLE",
  "TEAM_WORLD_NOT_SET",
] as const;
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export const CHECKPOINT_AUTO_STATUSES = [
  "PENDING_CHECK",
  "VERIFIED",
  "SUSPICIOUS",
  "CHECK_FAILED",
] as const;
export type CheckpointAutoStatus = (typeof CHECKPOINT_AUTO_STATUSES)[number];

export const CHECKPOINT_REVIEW_STATUSES = ["APPROVED", "FLAGGED"] as const;
export type CheckpointReviewStatus =
  (typeof CHECKPOINT_REVIEW_STATUSES)[number];

export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  USERNAME_TAKEN: "USERNAME_TAKEN",
  CARD_UNKNOWN: "CARD_UNKNOWN",
  CARD_NOT_LINKED: "CARD_NOT_LINKED",
  CARD_IN_USE: "CARD_IN_USE",
  PARTICIPANT_NOT_FOUND: "PARTICIPANT_NOT_FOUND",
  PARTICIPANT_HAS_CARD: "PARTICIPANT_HAS_CARD",
  UNKNOWN_MEAL: "UNKNOWN_MEAL",
  ALREADY_SERVED: "ALREADY_SERVED",
  NOT_CHECKED_IN: "NOT_CHECKED_IN",
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  NO_ROOM_AVAILABLE: "NO_ROOM_AVAILABLE",
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

export const ADMIN_PAGE_SIZE = 25;
export const SEARCH_MAX_LENGTH = 100;
export const MAX_PAGE = 10_000;

export const UNSTOP_TEAM_ID_PATTERN = /^U[A-Z0-9]{7}$/;
export const TEAM_NAME_MAX_LENGTH = 120;
export const PARTICIPANT_NAME_MAX_LENGTH = 120;
export const COLLEGE_MAX_LENGTH = 200;
export const EMAIL_MAX_LENGTH = 254;
export const TEAM_DESCRIPTION_MAX_LENGTH = 1000;
export const TEAM_MAX_MEMBERS = 4;

export const RSVP_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const RSVP_CODE_LENGTH = 8;
export const RSVP_CODE_MAX_ATTEMPTS = 10;

export const QR_CODE_MIN_LENGTH = 4;
export const QR_CODE_MAX_LENGTH = 32;

export const CARD_CODE_LENGTH = 8;
export const CARD_CODE_PATTERN = /^[1-9][0-9]{7}$/;
export const CARD_CODE_MAX_ATTEMPTS = 10;
export const CARD_GENERATE_MAX_COUNT = 5_000;

export const ROOM_NUMBER_MAX_LENGTH = 16;
export const ROOM_CAPACITY_MAX = 1_000;
export const MAX_ROOMS_RETURNED = 200;

export const PHONE_COUNTRY_CODE = "+91";
