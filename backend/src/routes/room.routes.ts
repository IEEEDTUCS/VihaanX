import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { getRooms } from "../controllers/room.controller";

const router = Router();

router.use(
  authenticate,
  requireKind("admin"),
  requireRole("VOLUNTEER", "SUPER_ADMIN"),
);

router.get("/", getRooms);

export const roomsRouter = router;
