import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import {
  deleteMeal,
  getCard,
  postCardLink,
  postCheckIn,
  postMeal,
  postUndoCheckIn,
} from "../controllers/checkin.controller";
import {
  cardCodeParams,
  linkCardBody,
  participantIdParams,
  participantMealParams,
} from "../schemas/checkin.schema";

const deskOnly = [
  authenticate,
  requireKind("admin"),
  requireRole("VOLUNTEER", "SUPER_ADMIN"),
] as const;

const cards = Router();

cards.use(...deskOnly);

cards.get("/:code", validate({ params: cardCodeParams }), getCard);

cards.post(
  "/:code/link",
  validate({ params: cardCodeParams, body: linkCardBody }),
  postCardLink,
);

export const cardsRouter = cards;

const participants = Router();

participants.use(...deskOnly);

participants.post(
  "/:id/meals/:mealId",
  validate({ params: participantMealParams }),
  postMeal,
);

participants.delete(
  "/:id/meals/:mealId",
  requireRole("SUPER_ADMIN"),
  validate({ params: participantMealParams }),
  deleteMeal,
);

export const checkinParticipantsRouter = participants;
