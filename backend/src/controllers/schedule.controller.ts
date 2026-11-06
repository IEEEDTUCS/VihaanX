import type { RequestHandler } from "express";

import { MEAL_SLOTS } from "../config/event";
import { ApiResponse } from "../utils/ApiResponse";

export const getSchedule: RequestHandler = (_req, res) => {
  res.status(200).json(new ApiResponse({ meals: MEAL_SLOTS }));
};
