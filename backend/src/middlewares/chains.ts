import { authenticate } from "./authenticate";
import { userRateLimiter } from "./rateLimit";
import { requireKind } from "./requireKind";
import { requireRole } from "./requireRole";

export const authenticated = [authenticate, userRateLimiter] as const;

export const participantOnly = [
  authenticate,
  userRateLimiter,
  requireKind("participant"),
] as const;

export const leaderOnly = [
  authenticate,
  userRateLimiter,
  requireKind("participant"),
  requireRole("LEADER"),
] as const;

export const deskOnly = [
  authenticate,
  userRateLimiter,
  requireKind("admin"),
  requireRole("VOLUNTEER", "SUPER_ADMIN"),
] as const;

export const superAdminOnly = [
  authenticate,
  userRateLimiter,
  requireKind("admin"),
  requireRole("SUPER_ADMIN"),
] as const;
