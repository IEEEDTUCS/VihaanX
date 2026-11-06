import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { uploadImage } from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import {
  putCheckpoint,
  putProject,
} from "../controllers/submission.controller";
import { checkpointRoundParams } from "../schemas/submission.schema";

const router = Router();

router.use(authenticate, requireKind("participant"), requireRole("LEADER"));

router.put("/project", uploadImage, putProject);

router.put(
  "/checkpoints/:round",
  validate({ params: checkpointRoundParams }),
  uploadImage,
  putCheckpoint,
);

export const meTeamRouter = router;
