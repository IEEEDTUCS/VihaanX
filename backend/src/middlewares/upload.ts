import multer from "multer";

import {
  ERROR_CODES,
  IMAGE_FIELD_NAME,
  IMAGE_FIELD_NAME_SIZE_MAX,
  IMAGE_FIELD_SIZE_MAX,
  IMAGE_MAX_BYTES,
  IMAGE_MIME_TYPES,
} from "../config/constants";
import { ApiError } from "../utils/ApiError";

const allowed: readonly string[] = IMAGE_MIME_TYPES;

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: IMAGE_MAX_BYTES,
    files: 1,
    fields: 20,
    fieldSize: IMAGE_FIELD_SIZE_MAX,
    fieldNameSize: IMAGE_FIELD_NAME_SIZE_MAX,
    parts: 22,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowed.includes(file.mimetype)) {
      callback(
        new ApiError(
          400,
          `${IMAGE_FIELD_NAME} must be a JPEG, PNG or WebP image`,
          ERROR_CODES.VALIDATION_ERROR,
        ),
      );
      return;
    }

    callback(null, true);
  },
}).single(IMAGE_FIELD_NAME);
