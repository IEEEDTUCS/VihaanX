import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import type { SetTeamRoomBody } from "../schemas/room.schema";
import type {
  ExportTeamsQuery,
  ListTeamsQuery,
  ReviewBody,
  SetBedsheetsBody,
  TeamIdParams,
  TeamRoundParams,
  UpdateTeamBody,
} from "../schemas/team.schema";
import {
  getTeamForAdmin,
  listTeamRowsForExport,
  listTeams,
  moveTeamRoom,
  recheckCheckpoint,
  recheckProject,
  reviewCheckpointSubmission,
  reviewProjectSubmission,
  setTeamBedsheets,
  updateTeamAsAdmin,
} from "../services/team.service";
import { ApiResponse } from "../utils/ApiResponse";
import { sendCsvAttachment } from "../utils/csv";

export const getTeams: RequestHandler = async (req, res) => {
  const query = req.validated?.query as ListTeamsQuery;

  const result = await listTeams(query);

  res.status(200).json(new ApiResponse(result));
};

export const getTeamsExport: RequestHandler = async (req, res) => {
  const query = req.validated?.query as ExportTeamsQuery;

  const table = await listTeamRowsForExport(query);

  sendCsvAttachment(res, "teams", table);
};

export const getTeam: RequestHandler = async (req, res) => {
  const params = req.validated?.params as TeamIdParams;

  const result = await getTeamForAdmin(params.id);

  res.status(200).json(new ApiResponse(result));
};

export const patchTeam: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as TeamIdParams;
  const body = req.validated?.body as UpdateTeamBody;

  const result = await updateTeamAsAdmin(auth.id, params.id, body);

  res.status(200).json(new ApiResponse(result));
};

export const putProjectReview: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as TeamIdParams;
  const body = req.validated?.body as ReviewBody;

  const result = await reviewProjectSubmission(auth.id, params.id, body);

  res.status(200).json(new ApiResponse(result));
};

export const putCheckpointReview: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as TeamRoundParams;
  const body = req.validated?.body as ReviewBody;

  const result = await reviewCheckpointSubmission(
    auth.id,
    params.id,
    params.round,
    body,
  );

  res.status(200).json(new ApiResponse(result));
};

export const postProjectRecheck: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as TeamIdParams;

  const result = await recheckProject(auth.id, params.id);

  res.status(200).json(new ApiResponse(result));
};

export const postCheckpointRecheck: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as TeamRoundParams;

  const result = await recheckCheckpoint(auth.id, params.id, params.round);

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
