import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import { RoomModel } from "../models/room.model";
import { TeamModel } from "../models/team.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { ERROR_CODES } from "../config/constants";
import { roomNumberSchema } from "../schemas/room.schema";

import { deskOnly } from "../middlewares/chains";
import { getRooms } from "../controllers/room.controller";

const router = Router();

router.use(...deskOnly);

router.get("/", getRooms);

const inventory = z.object({
  number: roomNumberSchema,
  capacity: z.number().int().min(1).max(1000),
  hardware: z.boolean(), small: z.boolean(), enabled: z.boolean(),
  slots: z.array(z.object({ label: z.string().trim().min(1).max(32), row: z.string().trim().min(1).max(32), enabled: z.boolean().default(true) }).strict()).min(1).max(500),
}).strict().refine((value) => new Set(value.slots.map((slot) => slot.label)).size === value.slots.length, { message: "Slot labels must be unique" });
router.put("/inventory", requireRole("SUPER_ADMIN"), validate({ body: inventory }), async (req, res) => {
  const data = req.validated!.body as z.infer<typeof inventory>;
  // An existing room must be empty: changing layout while teams are present needs a migration.
  if (await TeamModel.exists({ room: data.number })) throw new ApiError(409, "Cannot edit an occupied room", ERROR_CODES.CONFLICT);
  const room = await RoomModel.findOneAndUpdate(
    { number: data.number, slots: { $not: { $elemMatch: { teamId: { $ne: null } } } } },
    { $set: { ...data, available: data.capacity, slots: data.slots.map((slot) => ({ ...slot, teamId: null })) } },
    { upsert: true, returnDocument: "after", runValidators: true },
  );
  res.json(new ApiResponse({ room }));
});

export const roomsRouter = router;
