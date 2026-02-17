import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { userService } from "../services/user.service";
import { TokenPayloadType } from "../types/token.type";
import { UserType } from "../types/user.type";

class UserMiddleware {
    public async isActiveUser(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenPayload = res.locals.tokenPayload as TokenPayloadType;
            if (!tokenPayload) {
                if (!res.locals.tokenPayload) {
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "Token payload missing",
                    );
                }
            }

            const user = await userService.getById(tokenPayload.userId);
            if (!user.isActive) {
                throw new ApiError(
                    HttpStatusEnum.FORBIDDEN,
                    "User is inactive",
                );
            }

            res.locals.user = user;

            next();
        } catch (e) {
            next(e);
        }
    }

    public async isVerifiedUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const user = res.locals.user as UserType;

        if (!user) {
            return next(
                new ApiError(
                    HttpStatusEnum.UNAUTHORIZED,
                    "User not found in context",
                ),
            );
        }

        if (!user.isVerified) {
            return next(
                new ApiError(HttpStatusEnum.FORBIDDEN, "Email not verified"),
            );
        }
        next();
    }
}

export const userMiddleware = new UserMiddleware();
