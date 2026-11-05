import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { loginRateLimiter } from "../middlewares/rateLimit";
import { validate } from "../middlewares/validate";
import {
  adminLogin,
  logout,
  me,
  refresh,
} from "../controllers/auth.controller";
import { adminLoginBody, refreshBody } from "../schemas/auth.schema";

const router = Router();

router.post(
  "/admin/login",
  loginRateLimiter,
  validate({ body: adminLoginBody }),
  adminLogin,
);

router.post("/refresh", validate({ body: refreshBody }), refresh);

router.post("/logout", authenticate, logout);

router.get("/me", authenticate, me);

export const authRouter = router;
