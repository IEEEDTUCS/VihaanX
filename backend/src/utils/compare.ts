import { createHash, timingSafeEqual } from "node:crypto";

const digest = (value: string) =>
  createHash("sha256").update(value, "utf8").digest();

export const timingSafeEquals = (a: string, b: string) =>
  timingSafeEqual(digest(a), digest(b));
