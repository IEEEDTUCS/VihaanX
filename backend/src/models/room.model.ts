import { Schema, model } from "mongoose";

import { ROOM_CAPACITY_MAX, ROOM_NUMBER_MAX_LENGTH } from "../config/constants";

export type Room = {
  number: string;
  capacity: number;
  available: number;
  hardware: boolean;
  createdAt: Date;
};

const roomSchema = new Schema<Room>(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: ROOM_NUMBER_MAX_LENGTH,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: ROOM_CAPACITY_MAX,
      validate: {
        validator: Number.isInteger,
        message: "capacity must be a whole number",
      },
    },
    available: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "available must be a whole number",
      },
    },
    hardware: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "rooms",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

roomSchema.index({ hardware: 1, available: -1 });

export const RoomModel = model<Room>("Room", roomSchema);
