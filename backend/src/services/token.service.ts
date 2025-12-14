import jwt from "jsonwebtoken";

import { mainConfig } from "../configs/main.config";
import { TokenPayloadType } from "../types/token.type";

const {
    JWT_ACCESS_SECRET,
    JWT_ACCESS_LIFETIME,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_LIFETIME,
} = mainConfig;

class TokenService {
    public generateTokens(payload: TokenPayloadType) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: JWT_ACCESS_LIFETIME,
        });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_LIFETIME,
        });
        return { accessToken, refreshToken };
    }
}

export const tokenService = new TokenService();
