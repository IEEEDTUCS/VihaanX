import type { RequestHandler } from "express";

import { getStats } from "../services/stats.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getAdminStats: RequestHandler = async (_req, res) => {
  const stats = await getStats();

  res.status(200).json(new ApiResponse(stats));
};
