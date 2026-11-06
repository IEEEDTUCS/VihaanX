import { Router } from "express";

import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { healthRouter } from "./health.routes";
import { adminParticipantsRouter, meRouter } from "./participant.routes";
import { adminTeamsRouter } from "./team.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/me", meRouter);
router.use("/admin/volunteers", adminRouter);
router.use("/admin/participants", adminParticipantsRouter);
router.use("/admin/teams", adminTeamsRouter);

export const apiRouter = router;
