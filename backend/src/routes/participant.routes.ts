import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import {
  getMe,
  getParticipants,
  getParticipantsExport,
  putPpt,
  putSpecialChallenges,
} from "../controllers/participant.controller";
import {
  exportParticipantsQuery,
  listParticipantsQuery,
} from "../schemas/participant.schema";
import {
  pptBody,
  specialChallengesBody,
} from "../schemas/submission.schema";

const me = Router();

me.use(authenticate, requireKind("participant"));

me.get("/", getMe);
me.put("/team/ppt", validate({ body: pptBody }), putPpt);
me.put(
  "/team/special-challenges",
  validate({ body: specialChallengesBody }),
  putSpecialChallenges,
);

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

adminParticipants.get(
  "/export",
  validate({ query: exportParticipantsQuery }),
  getParticipantsExport,
);

export const adminParticipantsRouter = adminParticipants;
