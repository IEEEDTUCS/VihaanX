import { z } from "zod";

import {
  ACCESS_TOKEN_EXPIRY_DEFAULT,
  REFRESH_TOKEN_EXPIRY_DEFAULT,
  SUBMISSION_GRACE_SECONDS_MAX,
} from "./constants";

const originSchema = z
  .string()
  .refine((origin) => !origin.includes("*"), {
    error: "CORS_ORIGINS must not contain wildcards",
  })
  .refine((origin) => /^https?:\/\/[^/?#\s]+$/.test(origin), {
    error:
      "CORS_ORIGINS entries must look like https://dashboard.example " +
      "(scheme and host only, no trailing slash or path)",
  });

const ISO_WITH_OFFSET =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

const instantSchema = z
  .string()
  .regex(
    ISO_WITH_OFFSET,
    "must be an ISO 8601 time with an offset (e.g. 2026-11-14T14:00:00+05:30)",
  )
  .transform((value) => new Date(value))
  .refine((date) => !Number.isNaN(date.getTime()), "is not a real date");

const expirySchema = z
  .string()
  .regex(
    /^[1-9]\d*[smhd]$/,
    "must be a positive number followed by s, m, h or d (e.g. 1h or 2d)",
  );

const envSchema = z.object({
  MONGODB_URI: z
    .string({ error: "MONGODB_URI is required" })
    .min(1, "MONGODB_URI is required"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((value) =>
      (value ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0),
    )
    .pipe(z.array(originSchema)),

  // Proxy hops to trust for the real client IP: 0 locally, 1 on the host.
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  ACCESS_TOKEN_SECRET: z
    .string({ error: "ACCESS_TOKEN_SECRET is required" })
    .min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),

  REFRESH_TOKEN_SECRET: z
    .string({ error: "REFRESH_TOKEN_SECRET is required" })
    .min(32, "REFRESH_TOKEN_SECRET must be at least 32 characters"),

  ACCESS_TOKEN_EXPIRY: expirySchema.default(ACCESS_TOKEN_EXPIRY_DEFAULT),

  REFRESH_TOKEN_EXPIRY: expirySchema.default(REFRESH_TOKEN_EXPIRY_DEFAULT),

  GITHUB_TOKEN: z
    .string({ error: "GITHUB_TOKEN is required" })
    .min(1, "GITHUB_TOKEN is required"),

  CLOUDINARY_URL: z
    .string({ error: "CLOUDINARY_URL is required" })
    .regex(
      /^cloudinary:\/\/[^:@\s]+:[^:@\s]+@[^:@\/\s]+$/,
      "must look like cloudinary://<api_key>:<api_secret>@<cloud_name>",
    ),

  EVENT_START: instantSchema,

  PROJECT_OPEN: instantSchema,
  PROJECT_CLOSE: instantSchema,

  CHECKPOINT_1_OPEN: instantSchema,
  CHECKPOINT_1_CLOSE: instantSchema,
  CHECKPOINT_2_OPEN: instantSchema,
  CHECKPOINT_2_CLOSE: instantSchema,
  CHECKPOINT_3_OPEN: instantSchema,
  CHECKPOINT_3_CLOSE: instantSchema,
  CHECKPOINT_4_OPEN: instantSchema,
  CHECKPOINT_4_CLOSE: instantSchema,

  SUBMISSION_GRACE_SECONDS: z.coerce
    .number()
    .int()
    .min(0)
    .max(SUBMISSION_GRACE_SECONDS_MAX)
    .default(0),
});

type ScheduleWindow = { name: string; open: Date; close: Date };

const scheduleWindows = (
  value: z.infer<typeof envSchema>,
): ScheduleWindow[] => [
  { name: "PROJECT", open: value.PROJECT_OPEN, close: value.PROJECT_CLOSE },
  {
    name: "CHECKPOINT_1",
    open: value.CHECKPOINT_1_OPEN,
    close: value.CHECKPOINT_1_CLOSE,
  },
  {
    name: "CHECKPOINT_2",
    open: value.CHECKPOINT_2_OPEN,
    close: value.CHECKPOINT_2_CLOSE,
  },
  {
    name: "CHECKPOINT_3",
    open: value.CHECKPOINT_3_OPEN,
    close: value.CHECKPOINT_3_CLOSE,
  },
  {
    name: "CHECKPOINT_4",
    open: value.CHECKPOINT_4_OPEN,
    close: value.CHECKPOINT_4_CLOSE,
  },
];

const envSchemaWithChecks = envSchema
  .refine((value) => value.ACCESS_TOKEN_SECRET !== value.REFRESH_TOKEN_SECRET, {
    error:
      "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different, " +
      "otherwise a refresh token would be accepted as an access token",
  })
  .refine((value) => value.PROJECT_OPEN >= value.EVENT_START, {
    error: "PROJECT_OPEN must not be before EVENT_START",
  })
  .superRefine((value, ctx) => {
    const windows = scheduleWindows(value);

    for (const window of windows) {
      if (window.open >= window.close) {
        ctx.addIssue({
          code: "custom",
          message: `${window.name}_OPEN must be before ${window.name}_CLOSE`,
        });
      }
    }

    for (let index = 1; index < windows.length; index += 1) {
      const previous = windows[index - 1]!;
      const current = windows[index]!;

      if (current.open <= previous.open) {
        ctx.addIssue({
          code: "custom",
          message: `${current.name}_OPEN must be after ${previous.name}_OPEN`,
        });
      }

      if (current.close <= previous.close) {
        ctx.addIssue({
          code: "custom",
          message: `${current.name}_CLOSE must be after ${previous.name}_CLOSE`,
        });
      }
    }
  });

const parseEnv = () => {
  const result = envSchemaWithChecks.safeParse(process.env);

  if (!result.success) {
    // Print names and reasons only; never the values, which hold secrets.
    const problems = result.error.issues.map((issue) => {
      const name = issue.path.join(".");
      if (!name || issue.message.startsWith(name)) {
        return `  ${issue.message}`;
      }
      return `  ${name}: ${issue.message}`;
    });

    console.error("Invalid environment variables:");
    console.error([...new Set(problems)].join("\n"));
    console.error("See .env.example and docs/development.md.");
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();

export type Env = typeof env;
