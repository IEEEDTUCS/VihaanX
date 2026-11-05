import { Schema, model } from "mongoose";

import { ADMIN_ROLES, USERNAME_MAX_LENGTH } from "../config/constants";
import type { AdminRole } from "../config/constants";

export type Admin = {
  username: string;
  usernameLower: string;
  passwordHash: string;
  role: AdminRole;
  refreshTokenHash: string | null;
  tokenVersion: number;
  createdAt: Date;
};

const adminSchema = new Schema<Admin>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: USERNAME_MAX_LENGTH,
    },
    usernameLower: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: USERNAME_MAX_LENGTH,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ADMIN_ROLES,
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    collection: "admins",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

adminSchema.pre("validate", function setUsernameLower() {
  if (this.username) {
    this.usernameLower = this.username.trim().toLowerCase();
  }
});

export const AdminModel = model<Admin>("Admin", adminSchema);
