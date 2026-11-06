import { Router } from "express";

import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { cardsRouter, checkinParticipantsRouter } from "./checkin.routes";
import { healthRouter } from "./health.routes";
import { adminParticipantsRouter, meRouter } from "./participant.routes";
import { roomsRouter } from "./room.routes";
import { scheduleRouter } from "./schedule.routes";
import { adminTeamsRouter, deskTeamsRouter } from "./team.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/schedule", scheduleRouter);
router.use("/auth", authRouter);
router.use("/me", meRouter);
router.use("/cards", cardsRouter);
router.use("/participants", checkinParticipantsRouter);
router.use("/teams", deskTeamsRouter);
router.use("/rooms", roomsRouter);
router.use("/admin/volunteers", adminRouter);
router.use("/admin/participants", adminParticipantsRouter);
router.use("/admin/teams", adminTeamsRouter);

export const apiRouter = router;
