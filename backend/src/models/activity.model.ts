import { Schema, Types, model } from "mongoose";

export const ACTIVITY_ACTIONS = [
  "CARD_LINKED",
  "CHECKED_IN",
  "CHECK_IN_UNDONE",
  "MEAL_SERVED",
  "MEAL_UNDONE",
  "BEDSHEETS_SET",
  "ROOM_ALLOCATED",
  "ROOM_CHANGED",
  "TEAM_UPDATED",
  "CHECKPOINT_REVIEWED",
  "CHECK_RERUN",
  "VOLUNTEER_CREATED",
  "VOLUNTEER_DELETED",
] as const;

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

export type Activity = {
  actorId: Types.ObjectId;
  action: ActivityAction;
  participantId: Types.ObjectId | null;
  teamId: Types.ObjectId | null;
  details: Record<string, unknown>;
  createdAt: Date;
};

const activitySchema = new Schema<Activity>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    action: { type: String, required: true, enum: ACTIVITY_ACTIONS },
    participantId: {
      type: Schema.Types.ObjectId,
      ref: "Participant",
      default: null,
    },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    details: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: "activity",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ participantId: 1 });
activitySchema.index({ teamId: 1 });

export const ActivityModel = model<Activity>("Activity", activitySchema);
