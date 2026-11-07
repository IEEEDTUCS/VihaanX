import { Router } from "express";

import { superAdminOnly } from "../middlewares/chains";
import { validate } from "../middlewares/validate";
import {
  getVolunteers,
  postVolunteer,
  removeVolunteer,
} from "../controllers/admin.controller";
import { adminIdParams, createVolunteerBody } from "../schemas/admin.schema";

const router = Router();

router.use(...superAdminOnly);

router.get("/", getVolunteers);

router.post("/", validate({ body: createVolunteerBody }), postVolunteer);

router.delete("/:id", validate({ params: adminIdParams }), removeVolunteer);

export const adminRouter = router;
