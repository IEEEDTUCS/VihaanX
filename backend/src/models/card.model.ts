import { Schema, model } from "mongoose";

import { CARD_CODE_PATTERN } from "../config/constants";

export type Card = {
  code: string;
  createdAt: Date;
};

const cardSchema = new Schema<Card>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: CARD_CODE_PATTERN,
    },
  },
  {
    collection: "cards",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const CardModel = model<Card>("Card", cardSchema);
