import { Router } from "express";

import { leaderOnly } from "../middlewares/chains";
import { submitRateLimiter } from "../middlewares/rateLimit";
import { uploadImage } from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import {
  putCheckpoint,
  putProject,
} from "../controllers/submission.controller";
import { checkpointRoundParams } from "../schemas/submission.schema";

const router = Router();

router.use(...leaderOnly, submitRateLimiter);

router.put("/project", uploadImage, putProject);

router.put(
  "/checkpoints/:round",
  validate({ params: checkpointRoundParams }),
  uploadImage,
  putCheckpoint,
);

export const meTeamRouter = router;
