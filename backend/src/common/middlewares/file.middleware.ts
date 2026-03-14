import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";

class FileMiddleware {
    public isValidFile(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const file = req.files?.[key] as UploadedFile;

                if (!file) {
                    throw new ApiError(
                        HttpStatusEnum.BAD_REQUEST,
                        `Field '${key}' is missing a file`,
                    );
                }
                const allowedMimetypes = ["image/jpeg", "image/png"];
                const maxFileSize = 5 * 1024 * 1024;

                if (!allowedMimetypes.includes(file.mimetype)) {
                    throw new ApiError(
                        HttpStatusEnum.BAD_REQUEST,
                        `Unsupported file type. Allowed: ${allowedMimetypes.join(", ")}`,
                    );
                }
                if (file.size > maxFileSize) {
                    throw new ApiError(
                        HttpStatusEnum.BAD_REQUEST,
                        `File is too large. Max size: 5MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
                    );
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const fileMiddleware = new FileMiddleware();
