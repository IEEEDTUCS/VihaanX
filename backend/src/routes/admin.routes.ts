import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import {
  getVolunteers,
  postVolunteer,
  removeVolunteer,
} from "../controllers/admin.controller";
import { adminIdParams, createVolunteerBody } from "../schemas/admin.schema";

const router = Router();

router.use(authenticate, requireRole("SUPER_ADMIN"));

router.get("/", getVolunteers);

router.post("/", validate({ body: createVolunteerBody }), postVolunteer);

router.delete("/:id", validate({ params: adminIdParams }), removeVolunteer);

export const adminRouter = router;
