import cors from "cors";
import express from "express";
import helmet from "helmet";

import { API_PREFIX, API_ROOT, JSON_BODY_LIMIT } from "./config/constants";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { apiRateLimiter } from "./middlewares/rateLimit";
import { apiRouter } from "./routes/index";

export const createApp = () => {
  const app = express();

  // Real client IPs behind the host's proxy, so rate limiting keys correctly.
  app.set("trust proxy", env.TRUST_PROXY);

  app.use(helmet());

  // Allowlist only, no wildcards. With CORS_ORIGINS unset the list is empty
  // and no cross-origin browser request is allowed. Tokens travel in the
  // Authorization header, so credentialed requests are not needed.
  app.use(
    cors({
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : false,
      credentials: false,
    }),
  );

  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  app.use(API_ROOT, apiRateLimiter);

  app.use(API_PREFIX, apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
