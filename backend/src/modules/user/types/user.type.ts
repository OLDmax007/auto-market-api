import { BaseType } from "../../../common/types/base.type";
import { CurrencyAmountType } from "../../rate/rate.type";
import { PlatformRoleEnum } from "../enums/platform-role.enum";

export type UserType = {
    _id: string;
    platformRoleId: string;
    organizationId: string | null;
    subscriptionId?: string;
    firstName: string;
    lastName: string;
    age: number;
    password: string;
    email: string;
    balance: CurrencyAmountType;
    avatar: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
    isVerified: boolean;
} & BaseType;

export type UserCreateDtoType = Pick<
    UserType,
    "firstName" | "lastName" | "age" | "email" | "password"
>;

export type UserUpdateDtoType = Partial<
    Pick<UserType, "firstName" | "lastName" | "age">
>;

export type UserCreateDbType = Pick<UserType, "platformRoleId"> &
    UserCreateDtoType;

export type UserUpdateByAdminDtoType = Partial<
    Pick<UserType, "firstName" | "lastName" | "email" | "age" | "isVerified">
>;
export type UserLoginDtoType = Pick<UserType, "email" | "password">;

export type UserInitiatorType = {
    userId: string;
    initiatorId: string;
    initiatorRole: PlatformRoleEnum;
};
