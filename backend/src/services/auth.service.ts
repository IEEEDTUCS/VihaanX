import { ERROR_CODES } from "../config/constants";
import { logger } from "../config/logger";
import type { PublicAdmin } from "./admin.service";
import {
  findAdminByUsername,
  revokeAdminTokens,
  rotateRefreshTokenHash,
  setRefreshTokenHash,
  toPublicAdmin,
} from "./admin.service";
import {
  findParticipantForLogin,
  revokeParticipantTokens,
  rotateParticipantRefreshTokenHash,
  setParticipantRefreshTokenHash,
  toPublicParticipant,
} from "./participant.service";
import { ApiError } from "../utils/ApiError";
import { timingSafeEquals } from "../utils/compare";
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../utils/token";
import type { AccessTokenPayload } from "../utils/token";
import { verifyRefreshToken } from "../utils/token";
import { refreshTokenPayloadSchema } from "../schemas/auth.schema";
import { verifyPassword } from "../utils/password";
import type { RequestAuth } from "../types/express";

const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8DvKkXUMwcHFuFmBOZ4jvZXOrPZ.1u";

const DUMMY_CODE = "00000000";

const invalidCredentials = () =>
  new ApiError(
    401,
    "Invalid username or password",
    ERROR_CODES.INVALID_CREDENTIALS,
  );

const invalidParticipantCredentials = () =>
  new ApiError(
    401,
    "Invalid email, QR code or RSVP code. If you have not collected " +
      "your QR card yet, check in at the registration desk first.",
    ERROR_CODES.INVALID_CREDENTIALS,
  );

const unauthenticated = () =>
  new ApiError(401, "Not logged in", ERROR_CODES.UNAUTHENTICATED);

type StoreRefreshHash = (
  id: string,
  hash: string,
) => Promise<{ tokenVersion?: number } | null>;

const issueTokens = async (
  kind: "admin" | "participant",
  id: string,
  payloadFor: (ver: number) => AccessTokenPayload,
  store: StoreRefreshHash,
) => {
  const refreshToken = signRefreshToken({ sub: id, kind });

  const stored = await store(id, hashRefreshToken(refreshToken));

  if (!stored) {
    throw unauthenticated();
  }

  return {
    accessToken: signAccessToken(payloadFor(stored.tokenVersion ?? 0)),
    refreshToken,
  };
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

  const tokens = await issueTokens(
    "admin",
    publicAdmin.id,
    (ver) => ({
      sub: publicAdmin.id,
      kind: "admin",
      role: publicAdmin.role,
      ver,
    }),
    setRefreshTokenHash,
  );

  return { ...tokens, admin: publicAdmin };
};

export const loginParticipant = async (
  email: string,
  qrCode: string,
  rsvpCode: string,
) => {
  const participant = await findParticipantForLogin(email);

  if (!participant) {
    timingSafeEquals(qrCode, DUMMY_CODE);
    timingSafeEquals(rsvpCode, DUMMY_CODE);
    throw invalidParticipantCredentials();
  }

  const storedQrCode = participant.qrCode ?? "";
  const cardMatches =
    storedQrCode.length > 0 && timingSafeEquals(qrCode, storedQrCode);
  const codeMatches = timingSafeEquals(rsvpCode, participant.rsvpCode ?? "");

  if (!cardMatches || !codeMatches) {
    throw invalidParticipantCredentials();
  }

  const publicParticipant = toPublicParticipant(participant);

  const tokens = await issueTokens(
    "participant",
    publicParticipant.id,
    (ver) => ({
      sub: publicParticipant.id,
      kind: "participant",
      role: publicParticipant.role,
      ver,
    }),
    setParticipantRefreshTokenHash,
  );

  return { ...tokens, participant: publicParticipant };
};

type RefreshResult =
  | { accessToken: string; refreshToken: string; admin: PublicAdmin }
  | {
      accessToken: string;
      refreshToken: string;
      participant: ReturnType<typeof toPublicParticipant>;
    };

export const refreshTokens = async (
  refreshToken: string,
): Promise<RefreshResult> => {
  let claims;
  try {
    claims = refreshTokenPayloadSchema.safeParse(
      verifyRefreshToken(refreshToken),
    );
  } catch {
    throw unauthenticated();
  }

  if (!claims.success) {
    throw unauthenticated();
  }

  const id = claims.data.sub;
  const kind = claims.data.kind;
  const nextRefreshToken = signRefreshToken({ sub: id, kind });
  const currentHash = hashRefreshToken(refreshToken);
  const nextHash = hashRefreshToken(nextRefreshToken);

  if (kind === "admin") {
    const rotated = await rotateRefreshTokenHash(id, currentHash, nextHash);

    if (!rotated) {
      logger.warn({ adminId: id }, "refresh token rejected; revoking admin");
      await revokeAdminTokens(id);
      throw unauthenticated();
    }

    const publicAdmin = toPublicAdmin(rotated);

    return {
      accessToken: signAccessToken({
        sub: publicAdmin.id,
        kind: "admin",
        role: publicAdmin.role,
        ver: rotated.tokenVersion ?? 0,
      }),
      refreshToken: nextRefreshToken,
      admin: publicAdmin,
    };
  }

  const rotated = await rotateParticipantRefreshTokenHash(
    id,
    currentHash,
    nextHash,
  );

  if (!rotated) {
    logger.warn({ participantId: id }, "refresh token rejected");
    throw unauthenticated();
  }

  const publicParticipant = toPublicParticipant(rotated);

  return {
    accessToken: signAccessToken({
      sub: publicParticipant.id,
      kind: "participant",
      role: publicParticipant.role,
      ver: rotated.tokenVersion ?? 0,
    }),
    refreshToken: nextRefreshToken,
    participant: publicParticipant,
  };
};

export const logout = async (auth: RequestAuth) => {
  if (auth.kind === "admin") {
    await revokeAdminTokens(auth.id);
    return;
  }

  await revokeParticipantTokens(auth.id);
};
