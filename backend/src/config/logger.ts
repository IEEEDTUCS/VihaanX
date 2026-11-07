import { pino } from "pino";

import { LOG_LEVEL_DEFAULT, LOG_LEVEL_TEST_DEFAULT } from "./constants";
import { env } from "./env";

const level =
  env.LOG_LEVEL ??
  (env.NODE_ENV === "test" ? LOG_LEVEL_TEST_DEFAULT : LOG_LEVEL_DEFAULT);

export const REDACTED_PATHS = [
  "req.headers.authorization",
  "req.headers.cookie",
  "req.body",
  "res.headers['set-cookie']",
  "email",
  "phone",
  "password",
  "rsvpCode",
  "qrCode",
  "cardCode",
  "token",
  "accessToken",
  "refreshToken",
  "CLOUDINARY_URL",
  "GITHUB_TOKEN",
  "*.email",
  "*.phone",
  "*.password",
  "*.rsvpCode",
  "*.qrCode",
  "*.cardCode",
  "*.token",
  "*.accessToken",
  "*.refreshToken",
];

const options = {
  level,
  base: { env: env.NODE_ENV },
  redact: { paths: REDACTED_PATHS, censor: "[redacted]" },
  formatters: { level: (label: string) => ({ level: label }) },
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger =
  env.NODE_ENV === "development"
    ? pino({
        ...options,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname,env",
          },
        },
      })
    : pino(options, pino.destination({ dest: 1, sync: true }));
