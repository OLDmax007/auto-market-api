import { BaseType } from "../../common/types/base.type";

export type TokenType = {
    _id: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
} & BaseType;

export type TokenPayloadType = {
    userId: string;
    sessionId?: string;
    iat?: number;
    exp?: number;
};

export type TokenPairType = Pick<TokenType, "accessToken" | "refreshToken">;
