import assert from "node:assert/strict";
import test from "node:test";

import { normalizeScores } from "../../src/utils/judging";

test("normalizes each evaluator's scores using population standard deviation", () => {
  const values = normalizeScores([
    { key: "a", score: 10 },
    { key: "b", score: 20 },
    { key: "c", score: 30 },
  ]);

  assert.equal(values[1]?.mean, 20);
  assert.equal(values[1]?.standardDeviation, Math.sqrt(200 / 3));
  assert.ok((values[0]?.zScore ?? 0) < 0);
  assert.equal(Number((values[2]?.zScore ?? 0).toFixed(6)), 1.224745);
});

test("returns zero normalized scores when an evaluator gives every team the same score", () => {
  const values = normalizeScores([
    { key: "a", score: 20 },
    { key: "b", score: 20 },
  ]);

  assert.deepEqual(
    values.map((value) => value.zScore),
    [0, 0],
  );
});
