import { Router } from "express";
import { z } from "zod";
import { ParticipantModel } from "../models/participant.model";
import { objectIdSchema } from "../schemas/admin.schema";
import { emailSchema } from "../schemas/participant.schema";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { ERROR_CODES } from "../config/constants";
import { getAuth } from "../middlewares/authenticate";
import { logActivity } from "../services/activity.service";

import { participantOnly, superAdminOnly } from "../middlewares/chains";
import { validate } from "../middlewares/validate";
import {
  getMe,
  getParticipants,
  getParticipantsExport,
} from "../controllers/participant.controller";
import {
  exportParticipantsQuery,
  listParticipantsQuery,
} from "../schemas/participant.schema";

const me = Router();

me.use(...participantOnly);

me.get("/", getMe);

export const meRouter = me;

const adminParticipants = Router();

adminParticipants.use(...superAdminOnly);

adminParticipants.get(
  "/",
  validate({ query: listParticipantsQuery }),
  getParticipants,
);

adminParticipants.get(
  "/export",
  validate({ query: exportParticipantsQuery }),
  getParticipantsExport,
);

const editParticipant = z.object({ name: z.string().trim().min(1).max(120), email: emailSchema, college: z.string().trim().max(200) }).strict();
adminParticipants.patch("/:id", validate({ params: z.object({ id: objectIdSchema }).strict(), body: editParticipant }), async (req, res) => {
  const { id } = req.validated!.params as { id: string };
  const body = req.validated!.body as z.infer<typeof editParticipant>;
  const person = await ParticipantModel.findByIdAndUpdate(id, { $set: body }, { returnDocument: "after", runValidators: true }).lean();
  if (!person) throw new ApiError(404, "Participant not found", ERROR_CODES.NOT_FOUND);
  await logActivity({ actorId: getAuth(req).id, action: "PARTICIPANT_UPDATED", participantId: id, teamId: String(person.teamId), details: { fields: ["name", "email", "college"] } });
  res.json(new ApiResponse({ participant: { id: String(person._id), name: person.name, email: person.email, college: person.college } }));
});

export const adminParticipantsRouter = adminParticipants;
