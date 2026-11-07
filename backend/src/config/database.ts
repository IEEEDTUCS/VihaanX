import mongoose from "mongoose";

import {
  DATABASE_CONNECT_TIMEOUT_MS,
  DATABASE_MAX_POOL_SIZE,
  DATABASE_NAMES,
} from "./constants";
import { env } from "./env";
import { logger } from "./logger";

export const connectDatabase = async () => {
  mongoose.connection.on("disconnected", () => {
    logger.warn("mongodb disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("mongodb reconnected");
  });

  await mongoose.connect(env.MONGODB_URI, {
    dbName: DATABASE_NAMES[env.NODE_ENV],
    serverSelectionTimeoutMS: DATABASE_CONNECT_TIMEOUT_MS,
    maxPoolSize: DATABASE_MAX_POOL_SIZE,
  });

  logger.info(
    { database: mongoose.connection.name, maxPoolSize: DATABASE_MAX_POOL_SIZE },
    "mongodb connected",
  );
};

/** Closes the connection during graceful shutdown. */
export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  logger.info("mongodb connection closed");
};

/** True only when the connection is usable right now (`/health` uses this). */
export const isDatabaseConnected = () =>
  mongoose.connection.readyState === mongoose.ConnectionStates.connected;
