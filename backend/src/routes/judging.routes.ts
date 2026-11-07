import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { uploadCsv } from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import {
  calculateJudgingRound,
  getJudgingResults,
  importJudgingScores,
  previewJudgingScores,
} from "../controllers/judging.controller";
import {
  judgingRoundParams,
  judgingRoundQuery,
  judgingRoundTypeQuery,
} from "../schemas/judging.schema";

const router = Router();

router.use(authenticate, requireKind("admin"), requireRole("SUPER_ADMIN"));

router.post(
  "/scores/preview",
  validate({ query: judgingRoundQuery }),
  uploadCsv,
  previewJudgingScores,
);

router.post(
  "/scores/import",
  validate({ query: judgingRoundQuery }),
  uploadCsv,
  importJudgingScores,
);

router.post(
  "/rounds/:roundId/calculate",
  validate({ params: judgingRoundParams, query: judgingRoundTypeQuery }),
  calculateJudgingRound,
);

router.get(
  "/rounds/:roundId/results",
  validate({ params: judgingRoundParams, query: judgingRoundTypeQuery }),
  getJudgingResults,
);

export const judgingRouter = router;
