import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { authenticate, getAuth } from "../middlewares/authenticate";
import { requireKind } from "../middlewares/requireKind";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import { cardCodeSchema } from "../schemas/checkin.schema";
import { objectIdSchema } from "../schemas/admin.schema";
import { roomNumberSchema } from "../schemas/room.schema";
import { rsvpCodeSchema } from "../schemas/participant.schema";
import { getCardHolder } from "../services/card.service";
import { linkAndAllocate, replaceCard, retryAllocation, moveAllocation } from "../services/deskAllocation.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ParticipantModel } from "../models/participant.model";
import { toVolunteerView } from "../services/checkin.service";
import { ApiError } from "../utils/ApiError";
import { ERROR_CODES } from "../config/constants";

const router = Router();
router.use(authenticate, requireKind("admin"), requireRole("VOLUNTEER", "SUPER_ADMIN"));
const codeAttempts = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false, keyGenerator: (req) => getAuth(req).id });
const lookup = z.object({ code: cardCodeSchema }).strict();
const link = lookup.extend({ rsvpCode: rsvpCodeSchema }).strict();
const replacement = lookup.extend({ participantId: objectIdSchema, reason: z.string().trim().min(3).max(300) }).strict();
router.post("/lookup", validate({ body: lookup }), async (req, res) => {
  const { code } = req.validated!.body as z.infer<typeof lookup>;
  res.json(new ApiResponse(await getCardHolder(code)));
});
router.post("/link", codeAttempts, validate({ body: link }), async (req, res) => {
  const { code, rsvpCode } = req.validated!.body as z.infer<typeof link>;
  res.json(new ApiResponse(await linkAndAllocate(getAuth(req).id, code, rsvpCode)));
});
router.post("/participant-by-code", codeAttempts, validate({ body: z.object({ rsvpCode: rsvpCodeSchema }).strict() }), async (req, res) => {
  const { rsvpCode } = req.validated!.body as { rsvpCode: string };
  const person = await ParticipantModel.findOne({ rsvpCode }).lean();
  if (!person) throw new ApiError(404, "Invalid check-in code", ERROR_CODES.PARTICIPANT_NOT_FOUND);
  res.json(new ApiResponse(await toVolunteerView(person)));
});
router.post("/replace", validate({ body: replacement }), async (req, res) => {
  const { code, participantId, reason } = req.validated!.body as z.infer<typeof replacement>;
  res.json(new ApiResponse(await replaceCard(getAuth(req).id, participantId, code, reason)));
});
router.post("/retry-allocation", validate({ body: lookup }), async (req, res) => {
  const { code } = req.validated!.body as z.infer<typeof lookup>;
  res.json(new ApiResponse(await retryAllocation(getAuth(req).id, code)));
});
const move = z.object({ teamId: objectIdSchema, room: roomNumberSchema, reason: z.string().trim().min(3).max(300) }).strict();
router.post("/move", requireRole("SUPER_ADMIN"), validate({ body: move }), async (req, res) => {
  const data = req.validated!.body as z.infer<typeof move>;
  res.json(new ApiResponse(await moveAllocation(getAuth(req).id, data.teamId, data.room, data.reason)));
});
export const deskRouter = router;
