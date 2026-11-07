import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import { getActivity } from "../controllers/activity.controller";
import { listActivityQuery } from "../schemas/activity.schema";

const router = Router();

router.use(authenticate, requireKind("admin"), requireRole("SUPER_ADMIN"));

router.get("/", validate({ query: listActivityQuery }), getActivity);

export const activityRouter = router;
