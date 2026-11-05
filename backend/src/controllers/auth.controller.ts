import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import { findAdminForAuth, toPublicAdmin } from "../services/admin.service";
import type { AdminLoginBody, RefreshBody } from "../schemas/auth.schema";
import {
  loginAdmin,
  logoutAdmin,
  refreshTokens,
} from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { ERROR_CODES } from "../config/constants";

export const adminLogin: RequestHandler = async (req, res) => {
  const body = req.validated?.body as AdminLoginBody;

  const result = await loginAdmin(body.username, body.password);

  res.status(200).json(new ApiResponse(result));
};

export const me: RequestHandler = async (req, res) => {
  const auth = getAuth(req);

  const admin = await findAdminForAuth(auth.id);
  if (!admin) {
    throw new ApiError(401, "Not logged in", ERROR_CODES.UNAUTHENTICATED);
  }

  res.status(200).json(
    new ApiResponse({
      kind: auth.kind,
      role: auth.role,
      admin: toPublicAdmin(admin),
    }),
  );
};

export const refresh: RequestHandler = async (req, res) => {
  const body = req.validated?.body as RefreshBody;

  const result = await refreshTokens(body.refreshToken);

  res.status(200).json(new ApiResponse(result));
};

export const logout: RequestHandler = async (req, res) => {
  const auth = getAuth(req);

  await logoutAdmin(auth.id);

  res.status(200).json(new ApiResponse({ loggedOut: true }));
};
