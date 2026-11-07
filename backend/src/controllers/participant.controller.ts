import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import { ERROR_CODES } from "../config/constants";
import type {
  ExportParticipantsQuery,
  ListParticipantsQuery,
} from "../schemas/participant.schema";
import {
  getParticipantWithTeam,
  listParticipantRowsForExport,
  listParticipants,
} from "../services/participant.service";
import {
  submitPpt,
  updateSpecialChallenges,
} from "../services/submission.service";
import type { PptBody, SpecialChallengesBody } from "../schemas/submission.schema";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { sendCsvAttachment } from "../utils/csv";

export const getMe: RequestHandler = async (req, res) => {
  const auth = getAuth(req);

  if (auth.kind !== "participant") {
    throw new ApiError(
      403,
      "You are not allowed to do that",
      ERROR_CODES.FORBIDDEN,
    );
  }

  const result = await getParticipantWithTeam(auth.id, auth.teamId);

  res.status(200).json(new ApiResponse(result));
};

export const getParticipants: RequestHandler = async (req, res) => {
  const query = req.validated?.query as ListParticipantsQuery;

  const result = await listParticipants(query);

  res.status(200).json(new ApiResponse(result));
};

export const getParticipantsExport: RequestHandler = async (req, res) => {
  const query = req.validated?.query as ExportParticipantsQuery;

  const table = await listParticipantRowsForExport(query);

  sendCsvAttachment(res, "participants", table);
};

export const putPpt: RequestHandler = async (req, res) => {
  const auth = getAuth(req);

  if (auth.kind !== "participant" || auth.role !== "LEADER") {
    throw new ApiError(
      403,
      "Only the team leader can submit the PPT",
      ERROR_CODES.FORBIDDEN,
    );
  }

  const body = req.validated?.body as PptBody;
  const result = await submitPpt(auth.teamId, body.pptUrl);

  res.status(200).json(new ApiResponse(result));
};

export const putSpecialChallenges: RequestHandler = async (req, res) => {
  const auth = getAuth(req);

  if (auth.kind !== "participant" || auth.role !== "LEADER") {
    throw new ApiError(
      403,
      "Only the team leader can update special challenges",
      ERROR_CODES.FORBIDDEN,
    );
  }

  const body = req.validated?.body as SpecialChallengesBody;
  const result = await updateSpecialChallenges(
    auth.teamId,
    body.specialChallenge1,
    body.specialChallenge2,
  );

  res.status(200).json(new ApiResponse(result));
};
