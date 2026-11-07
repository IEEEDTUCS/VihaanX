import type { Server } from "node:http";

import { createApp } from "./app";
import {
  API_PREFIX,
  HEADERS_TIMEOUT_MS,
  KEEP_ALIVE_TIMEOUT_MS,
  SHUTDOWN_TIMEOUT_MS,
} from "./config/constants";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";

const isNotRunningError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code === "ERR_SERVER_NOT_RUNNING";

const closeServer = async (server: Server) =>
  new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error && !isNotRunningError(error)) {
        reject(error);
        return;
      }
      resolve();
    });
  });

const registerShutdown = (server: Server) => {
  let shuttingDown = false;

  const shutdown = async (reason: string, exitCode: number) => {
    if (shuttingDown) {
      logger.warn({ reason }, "signal received again, exiting now");
      process.exit(1);
    }

    shuttingDown = true;
    logger.info({ reason }, "shutting down");

    const forceExit = setTimeout(() => {
      logger.error("shutdown timed out, exiting");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    try {
      await closeServer(server);
      await disconnectDatabase();
      logger.info("shutdown complete");
      process.exit(exitCode);
    } catch (error) {
      logger.error({ err: error }, "shutdown failed");
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM", 0));
  process.on("SIGINT", () => void shutdown("SIGINT", 0));

  process.on("unhandledRejection", (reason) => {
    logger.error({ err: reason }, "unhandled promise rejection");
    void shutdown("Unhandled rejection", 1);
  });

  process.on("uncaughtException", (error) => {
    logger.error({ err: error }, "uncaught exception");
    void shutdown("Uncaught exception", 1);
  });
};

const warnAboutProductionConfig = () => {
  if (env.NODE_ENV !== "production") return;

  if (env.TRUST_PROXY === 0) {
    logger.warn(
      "TRUST_PROXY is 0 in production: every rate limit will key on the " +
        "proxy's IP, so one request can lock out the venue. Set it to 1.",
    );
  }

  const local = env.CORS_ORIGINS.filter((origin) =>
    /localhost|127\.0\.0\.1/.test(origin),
  );

  if (local.length > 0) {
    logger.warn(
      { origins: local },
      "CORS_ORIGINS contains a local origin in production",
    );
  }
};

export const startServer = async () => {
  warnAboutProductionConfig();

  try {
    await connectDatabase();
  } catch (error) {
    logger.error({ err: error }, "could not connect to mongodb");
    process.exit(1);
  }

  const server = createApp().listen(env.PORT);

  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT_MS;
  server.headersTimeout = HEADERS_TIMEOUT_MS;

  // express's listen callback fires even when the bind failed, so the
  // "listening" message comes from the event and failures are explicit.
  server.on("listening", () => {
    logger.info({ port: env.PORT, prefix: API_PREFIX }, "api listening");
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      logger.error(
        { port: env.PORT },
        "port is already in use: stop the other process or set PORT",
      );
    } else {
      logger.error({ err: error }, "server failed to start");
    }
    process.exit(1);
  });

  registerShutdown(server);
};

await startServer();
