import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import type {
  CardCodeParams,
  LinkCardBody,
  ParticipantIdParams,
  ParticipantMealParams,
  TableNoBody,
} from "../schemas/checkin.schema";
import { getCardHolder, linkCard } from "../services/card.service";
import {
  checkInParticipant,
  serveMeal,
  undoCheckIn,
  undoMeal,
  shortlistTeam,
  unshortlistTeam,
  assignTable,
} from "../services/checkin.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getCard: RequestHandler = async (req, res) => {
  const params = req.validated?.params as CardCodeParams;

  const result = await getCardHolder(params.code);

  res.status(200).json(new ApiResponse(result));
};

export const postCardLink: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as CardCodeParams;
  const body = req.validated?.body as LinkCardBody;

  const result = await linkCard(auth.id, params.code, body.rsvpCode);

  res.status(200).json(new ApiResponse(result));
};

export const postCheckIn: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as ParticipantIdParams;

  const result = await checkInParticipant(auth.id, params.id);

  res.status(200).json(new ApiResponse(result));
};

export const postUndoCheckIn: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as ParticipantIdParams;

  const result = await undoCheckIn(auth.id, params.id);

  res.status(200).json(new ApiResponse(result));
};

export const postMeal: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as ParticipantMealParams;

  const result = await serveMeal(auth.id, params.id, params.mealId);

  res.status(200).json(new ApiResponse(result));
};

export const deleteMeal: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as ParticipantMealParams;

  const result = await undoMeal(auth.id, params.id, params.mealId);

  res.status(200).json(new ApiResponse(result));
};


export const postShortlist: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as ParticipantIdParams;

  const result = await shortlistTeam(auth.id, params.id);

  res.status(200).json(new ApiResponse(result));
};

export const deleteShortlist: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as ParticipantIdParams;

  const result = await unshortlistTeam(auth.id, params.id);

  res.status(200).json(new ApiResponse(result));
};

export const patchTable: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as ParticipantIdParams;
  const body = req.validated?.body as TableNoBody;

  const result = await assignTable(auth.id, params.id, body.tableNo);

  res.status(200).json(new ApiResponse(result));
};
