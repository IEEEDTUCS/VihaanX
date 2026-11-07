import { z } from "zod";

import { ROOM_CAPACITY_MAX, ROOM_NUMBER_MAX_LENGTH } from "../config/constants";

export const roomNumberSchema = z
  .string()
  .trim()
  .min(1)
  .max(ROOM_NUMBER_MAX_LENGTH)
  .regex(
    /^[A-Za-z0-9 .\/-]+$/,
    "room number may contain only letters, digits, space, dot, slash and hyphen",
  );

export const setTeamRoomBody = z
  .object({
    room: roomNumberSchema,
  })
  .strict();

export const roomRowSchema = z.object({
  number: roomNumberSchema,
  capacity: z.coerce.number().int().min(1).max(ROOM_CAPACITY_MAX),
  hardware: z
    .string()
    .trim()
    .toLowerCase()
    .default("")
    .transform((value, ctx) => {
      if (value === "" || ["false", "no", "0", "n"].includes(value)) {
        return false;
      }
      if (["true", "yes", "1", "y"].includes(value)) return true;

      ctx.addIssue({
        code: "custom",
        message: `hardware must be true or false, not "${value}"`,
      });
      return false;
    }),
});

export type SetTeamRoomBody = z.infer<typeof setTeamRoomBody>;
export type RoomRow = z.infer<typeof roomRowSchema>;
