import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import { findAdminForAuth, toPublicAdmin } from "../services/admin.service";
import {
  findParticipantForAuth,
  toPublicParticipant,
} from "../services/participant.service";
import type { AdminLoginBody, RefreshBody } from "../schemas/auth.schema";
import type { ParticipantLoginBody } from "../schemas/participant.schema";
import {
  loginAdmin,
  loginParticipant,
  logout as logoutAccount,
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

export const participantLogin: RequestHandler = async (req, res) => {
  const body = req.validated?.body as ParticipantLoginBody;

  const result = await loginParticipant(body.email, body.qrCode, body.rsvpCode);

  res.status(200).json(new ApiResponse(result));
};

export const me: RequestHandler = async (req, res) => {
  const auth = getAuth(req);

  if (auth.kind === "admin") {
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
    return;
  }

  const participant = await findParticipantForAuth(auth.id);
  if (!participant) {
    throw new ApiError(401, "Not logged in", ERROR_CODES.UNAUTHENTICATED);
  }

  res.status(200).json(
    new ApiResponse({
      kind: auth.kind,
      role: auth.role,
      participant: toPublicParticipant(participant),
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

  await logoutAccount(auth);

  res.status(200).json(new ApiResponse({ loggedOut: true }));
};
