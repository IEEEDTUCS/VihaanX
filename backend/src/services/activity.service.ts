import { Types } from "mongoose";

import { ADMIN_PAGE_SIZE } from "../config/constants";
import type { ActivityAction } from "../config/constants";
import { ActivityModel } from "../models/activity.model";
import { AdminModel } from "../models/admin.model";
import type { ListActivityQuery } from "../schemas/activity.schema";

type LogActivityInput = {
  actorId: string;
  action: ActivityAction;
  participantId?: string | null;
  teamId?: string | null;
  details?: Record<string, unknown>;
};

export const logActivity = async (input: LogActivityInput) => {
  try {
    await ActivityModel.create({
      actorId: new Types.ObjectId(input.actorId),
      action: input.action,
      participantId: input.participantId
        ? new Types.ObjectId(input.participantId)
        : null,
      teamId: input.teamId ? new Types.ObjectId(input.teamId) : null,
      details: input.details ?? {},
    });
  } catch (error) {
    console.error(`Failed to write activity ${input.action}`, error);
  }
};

export const listActivity = async (query: ListActivityQuery) => {
  const filter: Record<string, unknown> = {};

  if (query.team) filter.teamId = new Types.ObjectId(query.team);
  if (query.participant) {
    filter.participantId = new Types.ObjectId(query.participant);
  }
  if (query.actor) filter.actorId = new Types.ObjectId(query.actor);
  if (query.action) filter.action = query.action;

  const [rows, total] = await Promise.all([
    ActivityModel.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((query.page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
    ActivityModel.countDocuments(filter),
  ]);

  const actorIds = [...new Set(rows.map((row) => String(row.actorId)))];

  const actors = await AdminModel.find({ _id: { $in: actorIds } })
    .select("username role")
    .lean();

  const byId = new Map(
    actors.map((actor) => [
      String(actor._id),
      {
        id: String(actor._id),
        username: actor.username,
        role: actor.role,
      },
    ]),
  );

  return {
    activity: rows.map((row) => ({
      id: String(row._id),
      action: row.action,
      actor: byId.get(String(row.actorId)) ?? null,
      participantId: row.participantId ? String(row.participantId) : null,
      teamId: row.teamId ? String(row.teamId) : null,
      details: row.details,
      createdAt: row.createdAt,
    })),
    page: query.page,
    pageSize: ADMIN_PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
};
