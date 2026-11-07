import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import type {
  JudgingRoundParams,
  JudgingRoundQuery,
  JudgingRoundTypeQuery,
} from "../schemas/judging.schema";
import {
  calculateJudgingRound as calculate,
  getJudgingResults as getResults,
  importJudgingScores as importScores,
  previewJudgingScores as preview,
} from "../services/judging.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const input = (req: Parameters<RequestHandler>[0]) =>
  req.validated?.query as JudgingRoundQuery;

const fileBuffer = (req: Parameters<RequestHandler>[0]) => {
  if (!req.file) {
    throw new ApiError(400, 'Attach the CSV as the "file" field', "VALIDATION_ERROR");
  }
  return req.file.buffer;
};

export const previewJudgingScores: RequestHandler = async (req, res) => {
  res.status(200).json(new ApiResponse(await preview(input(req), fileBuffer(req))));
};

export const importJudgingScores: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const result = await importScores(
    input(req),
    fileBuffer(req),
    req.file?.originalname ?? "scores.csv",
    auth.id,
  );
  res.status(201).json(new ApiResponse(result));
};

export const calculateJudgingRound: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as JudgingRoundParams;
  const query = req.validated?.query as JudgingRoundTypeQuery;
  res.status(200).json(new ApiResponse(await calculate({ ...params, ...query }, auth.id)));
};

export const getJudgingResults: RequestHandler = async (req, res) => {
  const params = req.validated?.params as JudgingRoundParams;
  const query = req.validated?.query as JudgingRoundTypeQuery;
  res.status(200).json(new ApiResponse(await getResults({ ...params, ...query })));
};
