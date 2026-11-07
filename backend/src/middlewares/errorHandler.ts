import type { ErrorRequestHandler } from "express";

import {
  ERROR_CODES,
  IMAGE_FIELD_NAME,
  IMAGE_MAX_BYTES,
} from "../config/constants";
import type { ErrorCode } from "../config/constants";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { ApiError } from "../utils/ApiError";

const BODY_PARSER_MESSAGES: Record<string, string> = {
  "entity.parse.failed": "Malformed JSON body",
  "entity.too.large": "Request body too large",
  "entity.verify.failed": "Invalid request body",
  "request.aborted": "Request aborted",
  "request.size.invalid": "Invalid request body size",
  "encoding.unsupported": "Unsupported content encoding",
  "charset.unsupported": "Unsupported charset",
};

type Mapped = { status: number; message: string; code?: ErrorCode };

const asRecord = (error: unknown): Record<string, unknown> | null =>
  typeof error === "object" && error !== null
    ? (error as Record<string, unknown>)
    : null;

const asBodyParserError = (error: unknown): Mapped | null => {
  const record = asRecord(error);
  if (!record || !(error instanceof Error)) return null;

  const { type } = record;
  const raw = record.status ?? record.statusCode;
  if (typeof type !== "string" || typeof raw !== "number") return null;
  if (raw < 400 || raw > 499) return null;

  return {
    status: raw,
    message: BODY_PARSER_MESSAGES[type] ?? "Invalid request body",
    code:
      type === "entity.too.large"
        ? ERROR_CODES.PAYLOAD_TOO_LARGE
        : ERROR_CODES.BAD_REQUEST,
  };
};

const UPLOAD_MESSAGES: Record<string, string> = {
  LIMIT_FILE_SIZE: `Image must be at most ${IMAGE_MAX_BYTES / 1024} KB`,
  LIMIT_FILE_COUNT: "Send exactly one image",
  LIMIT_UNEXPECTED_FILE: `The image must be sent as the "${IMAGE_FIELD_NAME}" field`,
};

const asUploadError = (error: unknown): Mapped | null => {
  const record = asRecord(error);
  if (!record || record.name !== "MulterError") return null;

  const code = typeof record.code === "string" ? record.code : "";

  if (code === "LIMIT_FILE_SIZE") {
    return {
      status: 413,
      message: UPLOAD_MESSAGES[code]!,
      code: ERROR_CODES.PAYLOAD_TOO_LARGE,
    };
  }

  return {
    status: 400,
    message: UPLOAD_MESSAGES[code] ?? "Invalid image upload",
    code: ERROR_CODES.VALIDATION_ERROR,
  };
};

/**
 * Mongoose errors that escape Zod validation. Field names are safe to return;
 * duplicate-key values are not, so only `keyPattern` is read, never `keyValue`.
 */
const asMongooseError = (error: unknown): Mapped | null => {
  const record = asRecord(error);
  if (!record) return null;

  if (record.code === 11000) {
    const pattern = asRecord(record.keyPattern);
    const fields = pattern ? Object.keys(pattern) : [];
    return {
      status: 409,
      message: fields.length
        ? `Already exists: ${fields.join(", ")}`
        : "Already exists",
      code: ERROR_CODES.CONFLICT,
    };
  }

  if (record.name === "CastError") {
    const path = typeof record.path === "string" ? record.path : "value";
    return {
      status: 400,
      message: `Invalid ${path}`,
      code: ERROR_CODES.VALIDATION_ERROR,
    };
  }

  if (record.name === "ValidationError") {
    const errors = asRecord(record.errors) ?? {};
    const details = Object.entries(errors)
      .map(([path, detail]) => {
        const message = asRecord(detail)?.message;
        return typeof message === "string" ? `${path}: ${message}` : path;
      })
      .join("; ");

    return {
      status: 400,
      message: details || "Invalid input",
      code: ERROR_CODES.VALIDATION_ERROR,
    };
  }

  return null;
};

const requestIdOf = (req: unknown) => {
  const id = (req as { id?: unknown }).id;
  return typeof id === "string" ? id : undefined;
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const requestId = requestIdOf(req);

  if (res.headersSent) {
    logger.error(
      { err: error, requestId, method: req.method },
      "error after the response had started",
    );
    next(error);
    return;
  }

  if (error instanceof ApiError) {
    if (error.status >= 500) {
      logger.error(
        { err: error, requestId, status: error.status, code: error.code },
        "request failed",
      );
    } else {
      logger.warn(
        {
          requestId,
          status: error.status,
          code: error.code,
          reason: error.message,
        },
        "request rejected",
      );
    }

    res.status(error.status).json({
      success: false,
      message: error.message,
      ...(error.code === undefined ? {} : { code: error.code }),
      ...(error.details === undefined ? {} : { details: error.details }),
      ...(requestId === undefined ? {} : { requestId }),
    });
    return;
  }

  const mapped =
    asBodyParserError(error) ?? asUploadError(error) ?? asMongooseError(error);
  if (mapped) {
    const name = asRecord(error)?.type ?? asRecord(error)?.name ?? "error";

    logger.warn(
      {
        requestId,
        status: mapped.status,
        code: mapped.code,
        reason: String(name),
      },
      "request rejected",
    );

    res.status(mapped.status).json({
      success: false,
      message: mapped.message,
      ...(mapped.code === undefined ? {} : { code: mapped.code }),
      ...(requestId === undefined ? {} : { requestId }),
    });
    return;
  }

  logger.error({ err: error, requestId }, "unexpected error");

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Something went wrong"
        : error instanceof Error
          ? error.message
          : "Something went wrong",
    ...(requestId === undefined ? {} : { requestId }),
  });
};
