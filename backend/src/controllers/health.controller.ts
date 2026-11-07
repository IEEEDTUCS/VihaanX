import type { RequestHandler } from "express";

import { isDatabaseConnected } from "../config/database";
import { ApiResponse } from "../utils/ApiResponse";

export const healthCheck: RequestHandler = (_req, res) => {
  const connected = isDatabaseConnected();

  const data = {
    database: connected ? "connected" : "disconnected",
    uptimeSeconds: Math.floor(process.uptime()),
  };

  if (connected) {
    res.status(200).json(new ApiResponse(data));
    return;
  }

  res.status(503).json(new ApiResponse(data, "Database disconnected", false));
};
