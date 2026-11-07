import { Router } from "express";

import { superAdminOnly } from "../middlewares/chains";
import { validate } from "../middlewares/validate";
import { getActivity } from "../controllers/activity.controller";
import { listActivityQuery } from "../schemas/activity.schema";

const router = Router();

router.use(...superAdminOnly);

router.get("/", validate({ query: listActivityQuery }), getActivity);

export const activityRouter = router;
