import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import { getMe, getParticipants } from "../controllers/participant.controller";
import { listParticipantsQuery } from "../schemas/participant.schema";

const me = Router();

me.use(authenticate, requireKind("participant"));

me.get("/", getMe);

export const meRouter = me;

const adminParticipants = Router();

adminParticipants.use(
  authenticate,
  requireKind("admin"),
  requireRole("SUPER_ADMIN"),
);

adminParticipants.get(
  "/",
  validate({ query: listParticipantsQuery }),
  getParticipants,
);

export const adminParticipantsRouter = adminParticipants;
