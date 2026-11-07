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

export const TEAM_CATEGORY_LABELS: Record<TeamCategory, string> = {
  WOMEN: "Women",
  FRESHERS: "Freshers",
  IEEE: "IEEE",
};

export const ROOM_STATUSES = [
  "ALLOCATED",
  "ALREADY_HAD_ROOM",
  "NO_ROOM_AVAILABLE",
  "TEAM_WORLD_NOT_SET",
] as const;
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export const CHECKPOINT_AUTO_STATUSES = [
  "NOT_SUBMITTED",
  "PENDING_CHECK",
  "VERIFIED",
  "SUSPICIOUS",
  "CHECK_FAILED",
] as const;
export type CheckpointAutoStatus = (typeof CHECKPOINT_AUTO_STATUSES)[number];

export const CHECKPOINT_REVIEW_STATUSES = ["APPROVED", "FLAGGED"] as const;
export type CheckpointReviewStatus =
  (typeof CHECKPOINT_REVIEW_STATUSES)[number];

export const TEAM_STATUS_FILTERS = [
  "SUSPICIOUS",
  "CHECK_FAILED",
  "UNREVIEWED",
] as const;
export type TeamStatusFilter = (typeof TEAM_STATUS_FILTERS)[number];

export const ACTIVITY_ACTIONS = [
  "CARD_LINKED",
  "CHECKED_IN",
  "CHECK_IN_UNDONE",
  "MEAL_SERVED",
  "MEAL_UNDONE",
  "BEDSHEETS_SET",
  "ROOM_ALLOCATED",
  "ROOM_CHANGED",
  "TEAM_UPDATED",
  "PROJECT_REVIEWED",
  "CHECKPOINT_REVIEWED",
  "CHECK_RERUN",
  "VOLUNTEER_CREATED",
  "VOLUNTEER_DELETED",
] as const;
export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

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
  NOT_SHORTLISTED: "NOT_SHORTLISTED",
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  NO_ROOM_AVAILABLE: "NO_ROOM_AVAILABLE",
  TEAM_WORLD_NOT_SET: "TEAM_WORLD_NOT_SET",
  PROJECT_NOT_SUBMITTED: "PROJECT_NOT_SUBMITTED",
  NOT_SUBMITTED: "NOT_SUBMITTED",
  NOTHING_TO_CHECK: "NOTHING_TO_CHECK",
  WINDOW_CLOSED: "WINDOW_CLOSED",
  UPLOAD_FAILED: "UPLOAD_FAILED",
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
export const EXPORT_MAX_ROWS = 5_000;

export const PANEL_MAX_LENGTH = 20;
export const TABLE_NO_MAX_LENGTH = 16;
export const PPT_URL_MAX_LENGTH = 500;
export const POINTS_MIN = 0;
export const POINTS_MAX = 100;
export const POINTS_DECIMALS = 2;
export const STARS_MIN = 0;
export const STARS_MAX = 5;
export const REVIEW_NOTE_MAX_LENGTH = 500;

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

export const CHECKPOINT_ROUNDS = [1, 2, 3, 4] as const;
export type CheckpointRound = (typeof CHECKPOINT_ROUNDS)[number];
export const CHECKPOINT_ROUND_COUNT = CHECKPOINT_ROUNDS.length;

export const PROJECT_TRACKS_MIN = 1;
export const PROJECT_TRACKS_MAX = 2;

export const GITHUB_API_BASE_URL = "https://api.github.com";
export const GITHUB_API_ACCEPT = "application/vnd.github+json";
export const GITHUB_API_VERSION = "2022-11-28";
export const GITHUB_TIMEOUT_MS = 5_000;
export const GITHUB_ACTIVITY_PAGE_SIZE = 100;

export const REPO_URL_PATTERN =
  /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9_.-]{1,100}?)(?:\.git)?\/?$/;
export const COMMIT_URL_PATTERN =
  /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9_.-]{1,100}?)(?:\.git)?\/commit\/([0-9a-fA-F]{7,40})\/?$/;
export const URL_MAX_LENGTH = 300;

export const PROJECT_MAX_EARLY_COMMITS = 3;
export const PROJECT_MAX_REPO_SIZE_KB = 500;

export const CHECKPOINT_MAX_CHANGED_LINES = 500;
export const CHECKPOINT_CODE_DUMP_LINES = 2_000;
export const CHECKPOINT_MAX_BINARY_SHARE = 0.8;
export const CHECKPOINT_GENERIC_MESSAGE_LINES = 200;
export const GENERIC_COMMIT_MESSAGES = [
  "update",
  "updates",
  "updated",
  "final",
  "final commit",
  "done",
  "fix",
  "fixes",
  "fixed",
  "changes",
  "change",
  "commit",
  "wip",
  "test",
  "temp",
  "asdf",
  "misc",
  "stuff",
  "work",
  ".",
] as const;

export const IMAGE_MAX_BYTES = 400 * 1024;
export const IMAGE_FIELD_NAME = "image";
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const CLOUDINARY_ROOT_FOLDER = "vihaanx";
export const CLOUDINARY_TIMEOUT_MS = 10_000;

export const SUBMISSION_GRACE_SECONDS_MAX = 3_600;

export const PROJECT_PUBLIC_ID = "project";
export const CHECKPOINT_PUBLIC_ID_PREFIX = "checkpoint-";
export const IMAGE_REVIEWED_NOTE = "Image: reviewed manually";

export const CSV_BOM = "\uFEFF";
export const CSV_CONTENT_TYPE = "text/csv; charset=utf-8";
