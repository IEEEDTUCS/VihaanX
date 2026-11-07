import type { RequestHandler } from "express";

import { listRooms } from "../services/room.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getRooms: RequestHandler = async (_req, res) => {
  const result = await listRooms();

  res.status(200).json(new ApiResponse(result));
};
