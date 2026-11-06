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
