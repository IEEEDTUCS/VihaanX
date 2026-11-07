import { z } from "zod";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../config/constants";

export const usernameSchema = z
  .string()
  .trim()
  .min(USERNAME_MIN_LENGTH)
  .max(USERNAME_MAX_LENGTH)
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "username may contain only letters, digits, dot, underscore and hyphen",
  );

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= PASSWORD_MAX_LENGTH,
    `password must be at most ${PASSWORD_MAX_LENGTH} bytes`,
  );

export const createVolunteerBody = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
  })
  .strict();

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "must be a MongoDB ObjectId");

export const adminIdParams = z
  .object({
    id: objectIdSchema,
  })
  .strict();

export type CreateVolunteerBody = z.infer<typeof createVolunteerBody>;
export type AdminIdParams = z.infer<typeof adminIdParams>;
