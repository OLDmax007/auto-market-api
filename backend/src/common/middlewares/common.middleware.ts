import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";

class CommonMiddleware {
    public isValidId(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params[key];
                if (!isObjectIdOrHexString(id)) {
                    throw new ApiError(
                        HttpStatusEnum.BAD_REQUEST,
                        `Invalid ${key}`,
                    );
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
