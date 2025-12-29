import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
    public checkToken(tokenType: TokenTypeEnum) {
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
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "No payload found",
                    );
                }

                req.res.locals.payload = payload;

                next();
            } catch (e: unknown) {
                next(e);
            }
        };
    }
}
export const authMiddleware = new AuthMiddleware();
