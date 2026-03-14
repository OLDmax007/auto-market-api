import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { ApiError } from "../../common/errors/api.error";
import { ActionTokenEnum } from "./enums/action-token.enum";
import { TokenEnum } from "./enums/token.enum";
import { tokenService } from "./serivces/token.service";

class AuthMiddleware {
    public checkToken(tokenType: TokenEnum, isOptional: boolean = false) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "Token not provided",
                    );
                }

                const token = authHeader.split(" ")[1];
                if (!token) {
                    throw new ApiError(
                        HttpStatusEnum.FORBIDDEN,
                        "Invalid token format",
                    );
                }

                const isTokenValid = await tokenService.isTokenValid(
                    token,
                    tokenType,
                );

                if (!isTokenValid)
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "User not authenticated. Please log in or register.",
                    );

                const payload = tokenService.verifyToken(token, tokenType);

                if (!payload) {
                    if (isOptional) return next();
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "Invalid or expired token payload",
                    );
                }

                res.locals.token = token;
                res.locals.tokenPayload = payload;

                next();
            } catch (e: unknown) {
                if (isOptional) {
                    return next();
                }
                next(e);
            }
        };
    }

    public checkActionToken(tokenType: ActionTokenEnum) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.query.token as string;

                if (!token) {
                    throw new ApiError(
                        HttpStatusEnum.BAD_REQUEST,
                        "Token is required in query parameters",
                    );
                }
                const payload = tokenService.verifyToken(token, tokenType);

                if (!payload) {
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "Invalid or expired token payload",
                    );
                }

                res.locals.tokenPayload = payload;
                next();
            } catch (e: unknown) {
                next(e);
            }
        };
    }
}
export const authMiddleware = new AuthMiddleware();
