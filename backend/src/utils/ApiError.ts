import type { ErrorCode } from "../config/constants";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: ErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(
    status: number,
    message: string,
    code?: ErrorCode,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    if (code !== undefined) {
      this.code = code;
    }
    if (details !== undefined) {
      this.details = details;
    }
    Error.captureStackTrace?.(this, ApiError);
  }
}
