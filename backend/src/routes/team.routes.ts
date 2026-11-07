import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import {
  getTeam,
  getTeams,
  getTeamsExport,
  patchTeam,
  patchTeamRoom,
  postCheckpointRecheck,
  postProjectRecheck,
  putCheckpointReview,
  putProjectReview,
  putTeamBedsheets,
} from "../controllers/team.controller";
import { setTeamRoomBody } from "../schemas/room.schema";
import {
  exportTeamsQuery,
  listTeamsQuery,
  reviewBody,
  setBedsheetsBody,
  teamIdParams,
  teamRoundParams,
  updateTeamBody,
} from "../schemas/team.schema";

const router = Router();

router.use(authenticate, requireKind("admin"), requireRole("SUPER_ADMIN"));

router.get("/", validate({ query: listTeamsQuery }), getTeams);

router.get("/export", validate({ query: exportTeamsQuery }), getTeamsExport);

router.get("/:id", validate({ params: teamIdParams }), getTeam);

router.patch(
  "/:id",
  validate({ params: teamIdParams, body: updateTeamBody }),
  patchTeam,
);

router.put(
  "/:id/project/review",
  validate({ params: teamIdParams, body: reviewBody }),
  putProjectReview,
);

router.put(
  "/:id/checkpoints/:round/review",
  validate({ params: teamRoundParams, body: reviewBody }),
  putCheckpointReview,
);

router.post(
  "/:id/project/recheck",
  validate({ params: teamIdParams }),
  postProjectRecheck,
);

router.post(
  "/:id/checkpoints/:round/recheck",
  validate({ params: teamRoundParams }),
  postCheckpointRecheck,
);

export const adminTeamsRouter = router;

const desk = Router();

desk.use(
  authenticate,
  requireKind("admin"),
  requireRole("VOLUNTEER", "SUPER_ADMIN"),
);

desk.put(
  "/:id/bedsheets",
  validate({ params: teamIdParams, body: setBedsheetsBody }),
  putTeamBedsheets,
);

desk.patch(
  "/:id/room",
  validate({ params: teamIdParams, body: setTeamRoomBody }),
  patchTeamRoom,
);

export const deskTeamsRouter = desk;
