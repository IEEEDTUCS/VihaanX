import mongoose from "mongoose";

import { DATABASE_CONNECT_TIMEOUT_MS, DATABASE_NAMES } from "./constants";
import { env } from "./env";

export const connectDatabase = async () => {
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  await mongoose.connect(env.MONGODB_URI, {
    dbName: DATABASE_NAMES[env.NODE_ENV],
    serverSelectionTimeoutMS: DATABASE_CONNECT_TIMEOUT_MS,
  });

  console.log(`MongoDB connected (${mongoose.connection.name})`);
};

/** Closes the connection during graceful shutdown. */
export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log("MongoDB connection closed");
};

/** True only when the connection is usable right now (`/health` uses this). */
export const isDatabaseConnected = () =>
  mongoose.connection.readyState === mongoose.ConnectionStates.connected;
