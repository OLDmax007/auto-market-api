import jwt from "jsonwebtoken";

import { mainConfig } from "../configs/main.config";
import { ActionTokenEnum } from "../enums/action-token.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { TokenPairType, TokenPayloadType } from "../types/token.type";

const {
    JWT_ACCESS_SECRET,
    JWT_ACCESS_LIFETIME,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_LIFETIME,
    JWT_VERIFY_SECRET,
    JWT_VERIFY_LIFETIME,
    JWT_RECOVERY_SECRET,
    JWT_RECOVERY_LIFETIME,
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
    public generateActionToken(
        payload: TokenPayloadType,
        tokenType: ActionTokenEnum,
    ): string {
        let secret: string;
        let expiresIn: any;

        switch (tokenType) {
            case ActionTokenEnum.VERIFY:
                secret = JWT_VERIFY_SECRET;
                expiresIn = JWT_VERIFY_LIFETIME;
                break;
            case ActionTokenEnum.RECOVER:
                secret = JWT_RECOVERY_SECRET;
                expiresIn = JWT_RECOVERY_LIFETIME;
                break;
        }
        return jwt.sign(payload, secret, {
            expiresIn,
        });
    }

    public verifyToken(
        token: string,
        tokenType: TokenTypeEnum | ActionTokenEnum,
    ): TokenPayloadType {
        try {
            let secret: string;
            switch (tokenType) {
                case TokenTypeEnum.ACCESS:
                    secret = JWT_ACCESS_SECRET;
                    break;
                case TokenTypeEnum.REFRESH:
                    secret = JWT_REFRESH_SECRET;
                    break;
                case ActionTokenEnum.VERIFY:
                    secret = JWT_VERIFY_SECRET;
                    break;
                case ActionTokenEnum.RECOVER:
                    secret = JWT_RECOVERY_SECRET;
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
        const tokenRecord = await tokenRepository.getOneByParams({
            [type]: token,
        });

        return !!tokenRecord;
    }
}

export const tokenService = new TokenService();
