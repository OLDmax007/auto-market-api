import jwt from "jsonwebtoken";

import { mainConfig } from "../configs/main.config";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import { Token } from "../models/token.model";
import { TokenPairType, TokenPayloadType } from "../types/token.type";

const {
    JWT_ACCESS_SECRET,
    JWT_ACCESS_LIFETIME,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_LIFETIME,
} = mainConfig;

class TokenService {
    public generateTokens(payload: TokenPayloadType): TokenPairType {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: JWT_ACCESS_LIFETIME,
        });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_LIFETIME,
        });
        return { accessToken, refreshToken };
    }

    public verifyToken(
        token: string,
        tokenType: TokenTypeEnum,
    ): TokenPayloadType {
        try {
            let secret: string;
            switch (tokenType) {
                case TokenTypeEnum.ACCESS:
                    secret = mainConfig.JWT_ACCESS_SECRET;
                    break;
                case TokenTypeEnum.REFRESH:
                    secret = mainConfig.JWT_REFRESH_SECRET;
                    break;
                default:
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "Unauthorized",
                    );
            }
            return jwt.verify(token, secret) as TokenPayloadType;
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error(e.message);
            }

            throw new ApiError(
                HttpStatusEnum.UNAUTHORIZED,
                "Invalid or expired token",
            );
        }
    }

    public async isTokenValid(
        token: string,
        type: TokenTypeEnum,
    ): Promise<boolean> {
        const tokenRecord = await Token.findOne({
            [type]: token,
        });

        return !!tokenRecord;
    }
}

export const tokenService = new TokenService();
