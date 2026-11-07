import { Router } from "express";

import { deskOnly } from "../middlewares/chains";
import { getRooms } from "../controllers/room.controller";

const router = Router();

router.use(...deskOnly);

router.get("/", getRooms);

export const roomsRouter = router;
