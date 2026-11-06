import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import type { SetTeamRoomBody } from "../schemas/room.schema";
import type {
  ListTeamsQuery,
  SetBedsheetsBody,
  TeamIdParams,
} from "../schemas/team.schema";
import {
  getTeamForAdmin,
  listTeams,
  moveTeamRoom,
  setTeamBedsheets,
} from "../services/team.service";
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

export const putTeamBedsheets: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as TeamIdParams;
  const body = req.validated?.body as SetBedsheetsBody;

  const result = await setTeamBedsheets(auth.id, params.id, body.count);

  res.status(200).json(new ApiResponse(result));
};

export const patchTeamRoom: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as TeamIdParams;
  const body = req.validated?.body as SetTeamRoomBody;

  const result = await moveTeamRoom(auth.id, params.id, body.room);

  res.status(200).json(new ApiResponse(result));
};
