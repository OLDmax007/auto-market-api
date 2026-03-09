import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";

class CommonMiddleware {
    public isValidId(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!isObjectIdOrHexString(req.params[key])) {
                    return next(
                        new ApiError(
                            HttpStatusEnum.BAD_REQUEST,
                            `Invalid ${key} format`,
                        ),
                    );
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }

    public validateBody(schema: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = await schema.validateAsync(req.body, {
                    abortEarly: true,
                });
                next();
            } catch (e) {
                const message =
                    e.details?.[0]?.message.replace(/"/g, "") || e.message;
                next(new ApiError(HttpStatusEnum.BAD_REQUEST, message));
            }
        };
    }

    public validateParams(schema: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.params = await schema.validateAsync(req.params, {
                    abortEarly: true,
                });
                next();
            } catch (e) {
                const message =
                    e.details?.[0]?.message.replace(/"/g, "") || e.message;
                next(new ApiError(HttpStatusEnum.BAD_REQUEST, message));
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
