import { Router } from "express";

import { superAdminOnly } from "../middlewares/chains";
import { getAdminStats } from "../controllers/stats.controller";

const router = Router();

router.use(...superAdminOnly);

router.get("/", getAdminStats);

export const statsRouter = router;
