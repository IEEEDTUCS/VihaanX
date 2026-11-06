import type { RequestHandler } from "express";

import type { ListTeamsQuery, TeamIdParams } from "../schemas/team.schema";
import { getTeamForAdmin, listTeams } from "../services/team.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getTeams: RequestHandler = async (req, res) => {
  const query = req.validated?.query as ListTeamsQuery;

  const result = await listTeams(query);

  res.status(200).json(new ApiResponse(result));
};

export const getTeam: RequestHandler = async (req, res) => {
  const params = req.validated?.params as TeamIdParams;

  const result = await getTeamForAdmin(params.id);

  res.status(200).json(new ApiResponse(result));
};
