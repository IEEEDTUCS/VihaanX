import assert from "node:assert/strict";
import test from "node:test";
import type { Request, Response } from "express";

import { MEAL_SLOTS, isMealSlot } from "../../src/config/event";
import { requireRole } from "../../src/middlewares/requireRole";
import { checkinParticipantsRouter } from "../../src/routes/checkin.routes";

test("all six meal rounds have distinct IDs, including both snacks", () => {
  assert.deepEqual(MEAL_SLOTS.map(({ id }) => id), [
    "lunch-d1", "dinner-d1", "midnight-d1", "midnight-2-d1", "breakfast-d2", "lunch-d2",
  ]);
  assert.equal(new Set(MEAL_SLOTS.map(({ id }) => id)).size, 6);
  assert.equal(isMealSlot("midnight-2-d1"), true);
  assert.equal(isMealSlot("lunch-d2"), true);
  assert.equal(isMealSlot("unknown"), false);
});

test("meal undo route rejects volunteers and permits super admins", () => {
  const route = checkinParticipantsRouter.stack.find(
    (layer) => layer.route?.path === "/:id/meals/:mealId" &&
      layer.route.stack.some((entry) => entry.method === "delete"),
  )?.route;
  assert.ok(route);
  const guard = route.stack[0]?.handle as ReturnType<typeof requireRole>;
  const request = (role: "VOLUNTEER" | "SUPER_ADMIN") =>
    ({ auth: { id: "507f1f77bcf86cd799439011", kind: "admin", role } }) as Request;
  assert.throws(() => guard(request("VOLUNTEER"), {} as Response, () => {}), /not allowed/);
  let passed = false;
  guard(request("SUPER_ADMIN"), {} as Response, () => { passed = true; });
  assert.equal(passed, true);
});
