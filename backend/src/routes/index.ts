import { Router } from "express";

import { activityRouter } from "./activity.routes";
import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { cardsRouter, checkinParticipantsRouter } from "./checkin.routes";
import { healthRouter } from "./health.routes";
import { judgingRouter } from "./judging.routes";
import { adminParticipantsRouter, meRouter } from "./participant.routes";
import { roomsRouter } from "./room.routes";
import { scheduleRouter } from "./schedule.routes";
import { statsRouter } from "./stats.routes";
import { meTeamRouter } from "./submission.routes";
import { adminTeamsRouter, deskTeamsRouter } from "./team.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/schedule", scheduleRouter);
router.use("/auth", authRouter);
router.use("/me/team", meTeamRouter);
router.use("/me", meRouter);
router.use("/cards", cardsRouter);
router.use("/participants", checkinParticipantsRouter);
router.use("/teams", deskTeamsRouter);
router.use("/rooms", roomsRouter);
router.use("/admin/volunteers", adminRouter);
router.use("/admin/participants", adminParticipantsRouter);
router.use("/admin/teams", adminTeamsRouter);
router.use("/admin/stats", statsRouter);
router.use("/admin/activity", activityRouter);
router.use("/admin/judging", judgingRouter);

export const apiRouter = router;
