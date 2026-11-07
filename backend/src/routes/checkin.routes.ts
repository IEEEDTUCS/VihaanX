import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import {
  deleteMeal,
  deleteShortlist,
  getCard,
  patchTable,
  postCardLink,
  postCheckIn,
  postMeal,
  postShortlist,
  postUndoCheckIn,
} from "../controllers/checkin.controller";
import {
  cardCodeParams,
  linkCardBody,
  participantIdParams,
  participantMealParams,
  tableNoBody,
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
  "/:id/check-in",
  validate({ params: participantIdParams }),
  postCheckIn,
);

participants.post(
  "/:id/undo-check-in",
  validate({ params: participantIdParams }),
  postUndoCheckIn,
);

participants.post(
  "/:id/meals/:mealId",
  validate({ params: participantMealParams }),
  postMeal,
);

participants.delete(
  "/:id/meals/:mealId",
  validate({ params: participantMealParams }),
  deleteMeal,
);

participants.post(
  "/:id/shortlist",
  validate({ params: participantIdParams }),
  postShortlist,
);

participants.delete(
  "/:id/shortlist",
  validate({ params: participantIdParams }),
  deleteShortlist,
);

participants.patch(
  "/:id/table",
  validate({ params: participantIdParams, body: tableNoBody }),
  patchTable,
);

export const checkinParticipantsRouter = participants;
