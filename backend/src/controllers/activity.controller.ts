import type { RequestHandler } from "express";

import type { ListActivityQuery } from "../schemas/activity.schema";
import { listActivity } from "../services/activity.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getActivity: RequestHandler = async (req, res) => {
  const query = req.validated?.query as ListActivityQuery;

  const result = await listActivity(query);

  res.status(200).json(new ApiResponse(result));
};
