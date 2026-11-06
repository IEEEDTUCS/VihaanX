import type { RequestHandler } from "express";

import { CHECKPOINT_ROUNDS } from "../config/constants";
import {
  CHECKPOINT_WINDOWS,
  MEAL_SLOTS,
  PROJECT_WINDOW,
  describeWindow,
  graceSeconds,
} from "../config/event";
import { ApiResponse } from "../utils/ApiResponse";

export const getSchedule: RequestHandler = (_req, res) => {
  const now = new Date();
  const grace = graceSeconds();

  res.status(200).json(
    new ApiResponse({
      meals: MEAL_SLOTS,
      graceSeconds: grace,
      project: describeWindow(PROJECT_WINDOW, now, grace),
      checkpoints: CHECKPOINT_ROUNDS.map((round) => ({
        round,
        ...describeWindow(CHECKPOINT_WINDOWS[round], now, grace),
      })),
    }),
  );
};
