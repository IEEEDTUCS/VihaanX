import { v2 as cloudinary } from "cloudinary";

import {
  CLOUDINARY_ROOT_FOLDER,
  CLOUDINARY_TIMEOUT_MS,
  ERROR_CODES,
} from "../config/constants";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { ApiError } from "../utils/ApiError";

cloudinary.config(env.CLOUDINARY_URL);

export type ImageUpload = {
  unstopId: string;
  publicId: string;
  buffer: Buffer;
};

export const uploadSubmissionImage = async (
  upload: ImageUpload,
): Promise<string> => {
  const startedAt = Date.now();

  try {
    const result = await new Promise<{ secure_url?: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `${CLOUDINARY_ROOT_FOLDER}/${upload.unstopId}`,
            public_id: upload.publicId,
            resource_type: "image",
            overwrite: true,
            invalidate: true,
            timeout: CLOUDINARY_TIMEOUT_MS,
          },
          (error, uploaded) => {
            if (error || !uploaded) {
              reject(error ?? new Error("Cloudinary returned no result"));
              return;
            }
            resolve(uploaded);
          },
        );

        stream.end(upload.buffer);
      },
    );

    if (!result.secure_url) {
      throw new Error("Cloudinary returned no secure_url");
    }

    logger.info(
      {
        team: upload.unstopId,
        publicId: upload.publicId,
        durationMs: Date.now() - startedAt,
      },
      "cloudinary upload",
    );

    return result.secure_url;
  } catch (error) {
    logger.error(
      {
        team: upload.unstopId,
        publicId: upload.publicId,
        durationMs: Date.now() - startedAt,
        reason: error instanceof Error ? error.message : String(error),
      },
      "cloudinary upload failed",
    );

    throw new ApiError(
      502,
      "Image upload failed, please try again",
      ERROR_CODES.UPLOAD_FAILED,
    );
  }
};
