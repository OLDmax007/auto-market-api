import { BaseType } from "./base.type";
import { UserType } from "./user.type";

export type TokenType = {
    _id: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
} & BaseType;

export type TokenPayloadType = Pick<
    UserType,
    "firstName" | "lastName" | "platformRoleId" | "email"
> & {
    userId: string;
    permissionIds: string[];
    iat?: number;
    exp?: number;
};

export type TokenPairType = Pick<TokenType, "accessToken" | "refreshToken">;
