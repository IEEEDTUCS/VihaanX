import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { getAdminStats } from "../controllers/stats.controller";

const router = Router();

router.use(authenticate, requireKind("admin"), requireRole("SUPER_ADMIN"));

router.get("/", getAdminStats);

export const statsRouter = router;
