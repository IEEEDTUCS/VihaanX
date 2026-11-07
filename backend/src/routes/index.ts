import { Router } from "express";
import type { RequestHandler } from "express";

import { noStore } from "../middlewares/noStore";

import { activityRouter } from "./activity.routes";
import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { cardsRouter, checkinParticipantsRouter } from "./checkin.routes";
import { deskRouter } from "./desk.routes";
import { healthRouter } from "./health.routes";
import { adminParticipantsRouter, meRouter } from "./participant.routes";
import { roomsRouter } from "./room.routes";
import { scheduleRouter } from "./schedule.routes";
import { statsRouter } from "./stats.routes";
import { meTeamRouter } from "./submission.routes";
import { adminTeamsRouter, deskTeamsRouter } from "./team.routes";

const router = Router();

const tag =
  (prefix: string): RequestHandler =>
  (req, _res, next) => {
    (req as { logPrefix?: string }).logPrefix = prefix;
    next();
  };

router.use("/health", tag("/health"), healthRouter);
router.use("/schedule", tag("/schedule"), scheduleRouter);
router.use("/auth", tag("/auth"), noStore, authRouter);
router.use("/me/team", tag("/me/team"), noStore, meTeamRouter);
router.use("/me", tag("/me"), noStore, meRouter);
router.use("/desk", deskRouter);
router.use("/cards", tag("/cards"), noStore, cardsRouter);
router.use(
  "/participants",
  tag("/participants"),
  noStore,
  checkinParticipantsRouter,
);
router.use("/teams", tag("/teams"), noStore, deskTeamsRouter);
router.use("/rooms", tag("/rooms"), noStore, roomsRouter);
router.use("/admin/volunteers", tag("/admin/volunteers"), noStore, adminRouter);
router.use(
  "/admin/participants",
  tag("/admin/participants"),
  noStore,
  adminParticipantsRouter,
);
router.use("/admin/teams", tag("/admin/teams"), noStore, adminTeamsRouter);
router.use("/admin/stats", tag("/admin/stats"), noStore, statsRouter);
router.use("/admin/activity", tag("/admin/activity"), noStore, activityRouter);

export const apiRouter = router;
