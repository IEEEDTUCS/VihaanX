import type { Request, RequestHandler } from "express";

import { ERROR_CODES } from "../config/constants";
import { getAuth } from "../middlewares/authenticate";
import type { CheckpointRoundParams } from "../schemas/submission.schema";
import {
  submitCheckpoint,
  submitProject,
} from "../services/submission.service";
import type { SubmissionImage } from "../services/submission.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const leaderTeamId = (req: Request) => {
  const auth = getAuth(req);

  if (auth.kind !== "participant" || auth.role !== "LEADER") {
    throw new ApiError(
      403,
      "Only the team leader can submit",
      ERROR_CODES.FORBIDDEN,
    );
  }

  return auth.teamId;
};

const imageOf = (req: Request): SubmissionImage =>
  req.file ? { buffer: req.file.buffer, mimetype: req.file.mimetype } : null;

export const putProject: RequestHandler = async (req, res) => {
  const teamId = leaderTeamId(req);

  const result = await submitProject(teamId, req.body ?? {}, imageOf(req));

  res.status(200).json(new ApiResponse(result));
};

export const putCheckpoint: RequestHandler = async (req, res) => {
  const teamId = leaderTeamId(req);
  const params = req.validated?.params as CheckpointRoundParams;

  const result = await submitCheckpoint(
    teamId,
    params.round,
    req.body ?? {},
    imageOf(req),
  );

  res.status(200).json(new ApiResponse(result));
};
