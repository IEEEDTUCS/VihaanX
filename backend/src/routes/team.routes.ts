import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import { getTeam, getTeams } from "../controllers/team.controller";
import { listTeamsQuery, teamIdParams } from "../schemas/team.schema";

const router = Router();

router.use(authenticate, requireKind("admin"), requireRole("SUPER_ADMIN"));

router.get("/", validate({ query: listTeamsQuery }), getTeams);

router.get("/:id", validate({ params: teamIdParams }), getTeam);

export const adminTeamsRouter = router;
