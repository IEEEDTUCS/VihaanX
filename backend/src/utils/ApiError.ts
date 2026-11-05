import type { ErrorCode } from "../config/constants";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: ErrorCode;

  constructor(status: number, message: string, code?: ErrorCode) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    if (code !== undefined) {
      this.code = code;
    }
    Error.captureStackTrace?.(this, ApiError);
  }
}
