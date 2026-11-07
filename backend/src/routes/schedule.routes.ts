import { Router } from "express";

import { getSchedule } from "../controllers/schedule.controller";

const router = Router();

router.get("/", getSchedule);

export const scheduleRouter = router;
