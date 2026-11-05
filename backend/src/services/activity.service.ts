import { Types } from "mongoose";

import { ActivityModel } from "../models/activity.model";
import type { ActivityAction } from "../models/activity.model";

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
