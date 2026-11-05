import { createHash, randomUUID } from "node:crypto";

import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { JWT_ALGORITHM } from "../config/constants";
import type { AdminRole, AuthKind } from "../config/constants";
import { env } from "../config/env";

export type AccessTokenPayload = {
  sub: string;
  kind: AuthKind;
  role: AdminRole;
  ver: number;
};

export type RefreshTokenPayload = {
  sub: string;
  kind: AuthKind;
};

const expiresIn = (value: string) => value as SignOptions["expiresIn"];

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: expiresIn(env.ACCESS_TOKEN_EXPIRY),
  });

export const signRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign({ ...payload, jti: randomUUID() }, env.REFRESH_TOKEN_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: expiresIn(env.REFRESH_TOKEN_EXPIRY),
  });

export const verifyAccessToken = (token: string): unknown =>
  jwt.verify(token, env.ACCESS_TOKEN_SECRET, { algorithms: [JWT_ALGORITHM] });

export const verifyRefreshToken = (token: string): unknown =>
  jwt.verify(token, env.REFRESH_TOKEN_SECRET, { algorithms: [JWT_ALGORITHM] });

export const hashRefreshToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
