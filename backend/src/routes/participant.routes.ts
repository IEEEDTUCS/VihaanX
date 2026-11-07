import { Router } from "express";

import { participantOnly, superAdminOnly } from "../middlewares/chains";
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

me.use(...participantOnly);

me.get("/", getMe);
me.put("/team/ppt", validate({ body: pptBody }), putPpt);
me.put(
  "/team/special-challenges",
  validate({ body: specialChallengesBody }),
  putSpecialChallenges,
);

export const meRouter = me;

const adminParticipants = Router();

adminParticipants.use(...superAdminOnly);

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
