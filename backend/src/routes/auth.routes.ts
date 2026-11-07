import { Router } from "express";

import { authenticated } from "../middlewares/chains";
import {
  loginRateLimiter,
  participantLoginRateLimiter,
} from "../middlewares/rateLimit";
import { validate } from "../middlewares/validate";
import {
  adminLogin,
  logout,
  me,
  participantLogin,
  refresh,
} from "../controllers/auth.controller";
import { adminLoginBody, refreshBody } from "../schemas/auth.schema";
import { participantLoginBody } from "../schemas/participant.schema";

const router = Router();

router.post(
  "/admin/login",
  loginRateLimiter,
  validate({ body: adminLoginBody }),
  adminLogin,
);

router.post(
  "/participant/login",
  participantLoginRateLimiter,
  validate({ body: participantLoginBody }),
  participantLogin,
);

router.post("/refresh", validate({ body: refreshBody }), refresh);

router.post("/logout", ...authenticated, logout);

router.get("/me", ...authenticated, me);

export const authRouter = router;
