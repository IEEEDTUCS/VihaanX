import type { Server } from "node:http";

import { createApp } from "./app";
import { API_PREFIX, SHUTDOWN_TIMEOUT_MS } from "./config/constants";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";

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
      console.warn(`${reason} received again, exiting now`);
      process.exit(1);
    }

    shuttingDown = true;
    console.log(`${reason}, shutting down`);

    const forceExit = setTimeout(() => {
      console.error("Shutdown timed out, exiting");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    try {
      await closeServer(server);
      await disconnectDatabase();
      console.log("Shutdown complete");
      process.exit(exitCode);
    } catch (error) {
      console.error("Shutdown failed", error);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM", 0));
  process.on("SIGINT", () => void shutdown("SIGINT", 0));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection", reason);
    void shutdown("Unhandled rejection", 1);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception", error);
    void shutdown("Uncaught exception", 1);
  });
};

export const startServer = async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }

  const server = createApp().listen(env.PORT);

  // express's listen callback fires even when the bind failed, so the
  // "listening" message comes from the event and failures are explicit.
  server.on("listening", () => {
    console.log(
      `Vihaan X API listening on http://localhost:${env.PORT}${API_PREFIX} ` +
        `(${env.NODE_ENV})`,
    );
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${env.PORT} is already in use. Stop the other process or set PORT.`,
      );
    } else {
      console.error("Server failed to start", error);
    }
    process.exit(1);
  });

  registerShutdown(server);
};

await startServer();
