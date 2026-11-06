import { ERROR_CODES, MAX_VOLUNTEERS_RETURNED } from "../config/constants";
import type { AdminRole } from "../config/constants";
import { AdminModel } from "../models/admin.model";
import type { Admin } from "../models/admin.model";
import { ApiError } from "../utils/ApiError";
import { hashPassword } from "../utils/password";

export type PublicAdmin = {
  id: string;
  username: string;
  role: AdminRole;
  createdAt: Date;
};

type AdminRecord = Admin & { _id: unknown };

export const toPublicAdmin = (admin: AdminRecord): PublicAdmin => ({
  id: String(admin._id),
  username: admin.username,
  role: admin.role,
  createdAt: admin.createdAt,
});

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code === 11000;

export const findAdminByUsername = async (username: string) =>
  AdminModel.findOne({ usernameLower: username.trim().toLowerCase() })
    .select("+passwordHash +tokenVersion")
    .lean();

export const findAdminForAuth = async (id: string) =>
  AdminModel.findById(id).select("+tokenVersion").lean();

// Stores the hash and reads tokenVersion back in one write, so a logout that
// lands mid-login cannot leave the caller holding a stale `ver`.
export const setRefreshTokenHash = async (id: string, hash: string) =>
  AdminModel.findOneAndUpdate(
    { _id: id },
    { $set: { refreshTokenHash: hash } },
    { returnDocument: "after", projection: "+tokenVersion" },
  ).lean();

export const rotateRefreshTokenHash = async (
  id: string,
  currentHash: string,
  nextHash: string,
) =>
  AdminModel.findOneAndUpdate(
    { _id: id, refreshTokenHash: currentHash },
    { $set: { refreshTokenHash: nextHash } },
    { returnDocument: "after", projection: "+tokenVersion" },
  ).lean();

export const revokeAdminTokens = async (id: string) => {
  await AdminModel.updateOne(
    { _id: id },
    { $set: { refreshTokenHash: null }, $inc: { tokenVersion: 1 } },
  );
};

export const createAdmin = async (
  username: string,
  password: string,
  role: AdminRole,
) => {
  const usernameLower = username.trim().toLowerCase();

  const existing = await AdminModel.exists({ usernameLower });
  if (existing) {
    throw new ApiError(
      409,
      "That username is already taken",
      ERROR_CODES.USERNAME_TAKEN,
    );
  }

  try {
    const created = await AdminModel.create({
      username: username.trim(),
      usernameLower,
      passwordHash: await hashPassword(password),
      role,
    });
    return toPublicAdmin(created.toObject());
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError(
        409,
        "That username is already taken",
        ERROR_CODES.USERNAME_TAKEN,
      );
    }
    throw error;
  }
};

export const createVolunteer = async (username: string, password: string) =>
  createAdmin(username, password, "VOLUNTEER");

export const listVolunteers = async () => {
  const volunteers = await AdminModel.find({ role: "VOLUNTEER" })
    .sort({ createdAt: -1 })
    .limit(MAX_VOLUNTEERS_RETURNED)
    .lean();

  return volunteers.map(toPublicAdmin);
};

export const deleteVolunteer = async (id: string) => {
  const deleted = await AdminModel.findOneAndDelete({
    _id: id,
    role: "VOLUNTEER",
  }).lean();

  if (!deleted) {
    throw new ApiError(404, "Volunteer not found", ERROR_CODES.NOT_FOUND);
  }

  return toPublicAdmin(deleted);
};
