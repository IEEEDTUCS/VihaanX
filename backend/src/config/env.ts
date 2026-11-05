import { z } from "zod";

import {
  ACCESS_TOKEN_EXPIRY_DEFAULT,
  REFRESH_TOKEN_EXPIRY_DEFAULT,
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
});

const envSchemaWithChecks = envSchema.refine(
  (value) => value.ACCESS_TOKEN_SECRET !== value.REFRESH_TOKEN_SECRET,
  {
    error:
      "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different, " +
      "otherwise a refresh token would be accepted as an access token",
  },
);

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
