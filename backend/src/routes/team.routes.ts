import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import {
  getTeam,
  getTeams,
  patchTeamRoom,
  putTeamBedsheets,
} from "../controllers/team.controller";
import { setTeamRoomBody } from "../schemas/room.schema";
import {
  listTeamsQuery,
  setBedsheetsBody,
  teamIdParams,
} from "../schemas/team.schema";

const router = Router();

router.use(authenticate, requireKind("admin"), requireRole("SUPER_ADMIN"));

router.get("/", validate({ query: listTeamsQuery }), getTeams);

router.get("/:id", validate({ params: teamIdParams }), getTeam);

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
