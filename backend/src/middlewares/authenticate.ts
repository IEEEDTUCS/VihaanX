import type { Request, RequestHandler } from "express";

import { ERROR_CODES } from "../config/constants";
import { findAdminForAuth } from "../services/admin.service";
import { accessTokenPayloadSchema } from "../schemas/auth.schema";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/token";
import type { RequestAuth } from "../types/express";

const unauthenticated = () =>
  new ApiError(401, "Not logged in", ERROR_CODES.UNAUTHENTICATED);

const readBearerToken = (req: Request) => {
  const header = req.get("authorization");
  if (!header) return null;

  const [scheme, token, ...rest] = header.split(" ");
  if (rest.length > 0) return null;
  if (!scheme || scheme.toLowerCase() !== "bearer") return null;
  if (!token) return null;

  return token;
};

export const authenticate: RequestHandler = async (req, _res, next) => {
  const token = readBearerToken(req);
  if (!token) {
    throw unauthenticated();
  }

  let claims;
  try {
    claims = accessTokenPayloadSchema.safeParse(verifyAccessToken(token));
  } catch {
    throw unauthenticated();
  }

  if (!claims.success) {
    throw unauthenticated();
  }

  if (claims.data.kind !== "admin") {
    throw unauthenticated();
  }

  const admin = await findAdminForAuth(claims.data.sub);
  if (!admin) {
    throw unauthenticated();
  }

  if (claims.data.ver !== (admin.tokenVersion ?? 0)) {
    throw unauthenticated();
  }

  req.auth = {
    id: String(admin._id),
    kind: "admin",
    role: admin.role,
  };

  next();
};

export const getAuth = (req: Request): RequestAuth => {
  if (!req.auth) {
    throw unauthenticated();
  }
  return req.auth;
};
