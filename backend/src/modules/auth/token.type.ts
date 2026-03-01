import { BaseType } from "../../common/types/base.type";
import { UserType } from "../user/types/user.type";

export type TokenType = {
    _id: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
} & BaseType;

export type TokenPayloadType = Pick<
    UserType,
    "email" | "firstName" | "lastName"
> & {
    userId: string;
    iat?: number;
    exp?: number;
};
export type TokenPayloadBuildType = Omit<TokenPayloadType, "exp" | "iat">;

export type TokenPairType = Pick<TokenType, "accessToken" | "refreshToken">;
