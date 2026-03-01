import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { ensureIsActive } from "../../../common/helpers/ensure.helper";
import { TokenPayloadType } from "../../auth/token.type";
import { userService } from "../services/user.service";
import { userAccessService } from "../services/user-access.service";
import { UserType } from "../types/user.type";

class UserMiddleware {
    public async isActiveUser(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenPayload = res.locals.tokenPayload as TokenPayloadType;
            if (!tokenPayload) {
                throw new ApiError(
                    HttpStatusEnum.UNAUTHORIZED,
                    "Token payload missing",
                );
            }

            const user = await userService.getById(tokenPayload.userId);
            ensureIsActive(user.isActive, "Your account is deactivated");
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
        try {
            const user = res.locals.user as UserType;

            if (!user) {
                throw new ApiError(
                    HttpStatusEnum.UNAUTHORIZED,
                    "Authentication required",
                );
            }

            userAccessService.checkIsVerified(user.isVerified);

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const userMiddleware = new UserMiddleware();
