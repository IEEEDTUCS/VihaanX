import { ERROR_CODES } from "../config/constants";
import type { PublicAdmin } from "./admin.service";
import {
  findAdminByUsername,
  revokeAdminTokens,
  rotateRefreshTokenHash,
  setRefreshTokenHash,
  toPublicAdmin,
} from "./admin.service";
import { ApiError } from "../utils/ApiError";
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import { refreshTokenPayloadSchema } from "../schemas/auth.schema";
import { verifyPassword } from "../utils/password";

const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8DvKkXUMwcHFuFmBOZ4jvZXOrPZ.1u";

const invalidCredentials = () =>
  new ApiError(
    401,
    "Invalid username or password",
    ERROR_CODES.INVALID_CREDENTIALS,
  );

const unauthenticated = () =>
  new ApiError(401, "Not logged in", ERROR_CODES.UNAUTHENTICATED);

const issueTokens = async (admin: PublicAdmin) => {
  const refreshToken = signRefreshToken({ sub: admin.id, kind: "admin" });

  const stored = await setRefreshTokenHash(
    admin.id,
    hashRefreshToken(refreshToken),
  );

  if (!stored) {
    throw unauthenticated();
  }

  const accessToken = signAccessToken({
    sub: admin.id,
    kind: "admin",
    role: admin.role,
    ver: stored.tokenVersion ?? 0,
  });

  return { accessToken, refreshToken };
};

export const loginAdmin = async (username: string, password: string) => {
  const admin = await findAdminByUsername(username);

  if (!admin) {
    await verifyPassword(password, DUMMY_HASH);
    throw invalidCredentials();
  }

  const passwordMatches = await verifyPassword(password, admin.passwordHash);
  if (!passwordMatches) {
    throw invalidCredentials();
  }

  const publicAdmin = toPublicAdmin(admin);
  const tokens = await issueTokens(publicAdmin);

  return { ...tokens, admin: publicAdmin };
};

export const refreshTokens = async (refreshToken: string) => {
  let claims;
  try {
    claims = refreshTokenPayloadSchema.safeParse(
      verifyRefreshToken(refreshToken),
    );
  } catch {
    throw unauthenticated();
  }

  if (!claims.success || claims.data.kind !== "admin") {
    throw unauthenticated();
  }

  const adminId = claims.data.sub;
  const nextRefreshToken = signRefreshToken({ sub: adminId, kind: "admin" });

  // One conditional update: the presented token's hash is in the filter, so
  // two concurrent refreshes cannot both rotate. No read-then-write.
  const rotated = await rotateRefreshTokenHash(
    adminId,
    hashRefreshToken(refreshToken),
    hashRefreshToken(nextRefreshToken),
  );

  if (!rotated) {
    // The stored hash did not match: a replay, a superseded token, or an
    // account that is gone. Treat it as theft and revoke everything.
    console.warn(`Refresh token rejected for admin ${adminId}`);
    await revokeAdminTokens(adminId);
    throw unauthenticated();
  }

  const publicAdmin = toPublicAdmin(rotated);

  const accessToken = signAccessToken({
    sub: publicAdmin.id,
    kind: "admin",
    role: publicAdmin.role,
    ver: rotated.tokenVersion ?? 0,
  });

  return { accessToken, refreshToken: nextRefreshToken, admin: publicAdmin };
};

export const logoutAdmin = async (id: string) => {
  await revokeAdminTokens(id);
};
