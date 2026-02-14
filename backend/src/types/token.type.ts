import { PlatformRoleEnum } from "../enums/platform-role.enum";
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
    "platformRoleId" | "isActive" | "isVerified"
> & {
    userId: string;
    permissionIds: string[];
    role: PlatformRoleEnum;
    isPremium: boolean;
    iat?: number;
    exp?: number;
};
export type TokenPayloadBuildType = Omit<TokenPayloadType, "exp" | "iat">;

export type TokenPairType = Pick<TokenType, "accessToken" | "refreshToken">;
