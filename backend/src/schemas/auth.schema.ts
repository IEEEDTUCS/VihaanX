import { z } from "zod";

import {
  ADMIN_ROLES,
  AUTH_KINDS,
  PARTICIPANT_ROLES,
} from "../config/constants";
import { objectIdSchema, passwordSchema, usernameSchema } from "./admin.schema";

export const adminLoginBody = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
  })
  .strict();

export const refreshBody = z
  .object({
    refreshToken: z.string().min(1).max(4096),
  })
  .strict();

const versionSchema = z.number().int().min(0);

export const accessTokenPayloadSchema = z.discriminatedUnion("kind", [
  z.object({
    sub: objectIdSchema,
    kind: z.literal("admin"),
    role: z.enum(ADMIN_ROLES),
    ver: versionSchema,
  }),
  z.object({
    sub: objectIdSchema,
    kind: z.literal("participant"),
    role: z.enum(PARTICIPANT_ROLES),
    ver: versionSchema,
  }),
]);

export const refreshTokenPayloadSchema = z.object({
  sub: objectIdSchema,
  kind: z.enum(AUTH_KINDS),
  jti: z.string().min(1),
});

export type AdminLoginBody = z.infer<typeof adminLoginBody>;
export type RefreshBody = z.infer<typeof refreshBody>;
