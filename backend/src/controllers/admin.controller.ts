import type { RequestHandler } from "express";

import { getAuth } from "../middlewares/authenticate";
import type {
  AdminIdParams,
  CreateVolunteerBody,
} from "../schemas/admin.schema";
import {
  createVolunteer,
  deleteVolunteer,
  listVolunteers,
} from "../services/admin.service";
import { logActivity } from "../services/activity.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getVolunteers: RequestHandler = async (_req, res) => {
  const volunteers = await listVolunteers();

  res.status(200).json(new ApiResponse({ volunteers }));
};

export const postVolunteer: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const body = req.validated?.body as CreateVolunteerBody;

  const volunteer = await createVolunteer(body.username, body.password);

  await logActivity({
    actorId: auth.id,
    action: "VOLUNTEER_CREATED",
    details: { volunteerId: volunteer.id, username: volunteer.username },
  });

  res.status(201).json(new ApiResponse({ volunteer }));
};

export const removeVolunteer: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const params = req.validated?.params as AdminIdParams;

  const volunteer = await deleteVolunteer(params.id);

  await logActivity({
    actorId: auth.id,
    action: "VOLUNTEER_DELETED",
    details: { volunteerId: volunteer.id, username: volunteer.username },
  });

  res.status(200).json(new ApiResponse({ deleted: true, volunteer }));
};
