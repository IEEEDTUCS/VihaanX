import { CHECKPOINT_ROUNDS } from "./constants";
import type { CheckpointRound } from "./constants";
import { env } from "./env";

export const MEAL_SLOTS = [
  { id: "lunch-d1", label: "Lunch, day 1" },
  { id: "dinner-d1", label: "Dinner, day 1" },
  { id: "midnight-d1", label: "Midnight snack" },
  { id: "breakfast-d2", label: "Breakfast, day 2" },
] as const;

export type MealSlot = (typeof MEAL_SLOTS)[number];
export type MealSlotId = MealSlot["id"];

export const MEAL_SLOT_IDS: readonly MealSlotId[] = MEAL_SLOTS.map(
  (slot) => slot.id,
);

export const isMealSlot = (value: string): value is MealSlotId =>
  MEAL_SLOT_IDS.some((id) => id === value);

export const SUBMISSION_WINDOW_STATES = ["upcoming", "open", "closed"] as const;
export type SubmissionWindowState = (typeof SUBMISSION_WINDOW_STATES)[number];

export type SubmissionWindow = {
  open: Date;
  close: Date;
};

export const PROJECT_WINDOW: SubmissionWindow = {
  open: env.PROJECT_OPEN,
  close: env.PROJECT_CLOSE,
};

export const CHECKPOINT_WINDOWS: Record<CheckpointRound, SubmissionWindow> = {
  1: { open: env.CHECKPOINT_1_OPEN, close: env.CHECKPOINT_1_CLOSE },
  2: { open: env.CHECKPOINT_2_OPEN, close: env.CHECKPOINT_2_CLOSE },
  3: { open: env.CHECKPOINT_3_OPEN, close: env.CHECKPOINT_3_CLOSE },
  4: { open: env.CHECKPOINT_4_OPEN, close: env.CHECKPOINT_4_CLOSE },
};

export const graceSeconds = () => env.SUBMISSION_GRACE_SECONDS;

export const effectiveClose = (window: SubmissionWindow, grace: number) =>
  new Date(window.close.getTime() + grace * 1_000);

export const windowState = (
  window: SubmissionWindow,
  now: Date,
  grace: number,
): SubmissionWindowState => {
  if (now < window.open) return "upcoming";
  if (now <= effectiveClose(window, grace)) return "open";
  return "closed";
};

export const isWindowOpen = (
  window: SubmissionWindow,
  now: Date,
  grace: number,
) => windowState(window, now, grace) === "open";

export const isCheckpointRound = (value: number): value is CheckpointRound =>
  CHECKPOINT_ROUNDS.some((round) => round === value);

export const describeWindow = (
  window: SubmissionWindow,
  now: Date,
  grace: number,
) => ({
  open: window.open.toISOString(),
  close: window.close.toISOString(),
  state: windowState(window, now, grace),
});
