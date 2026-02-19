import { BaseType } from "./base.type";
import { CurrencyAmountType } from "./rate.type";

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
    isVerified: boolean;
} & BaseType;

export type UserCreateDtoType = Pick<
    UserType,
    "firstName" | "lastName" | "age" | "email" | "password"
>;

export type UserCreateDbType = Pick<UserType, "platformRoleId"> &
    UserCreateDtoType;

export type UserUpdateDtoType = Partial<
    Pick<UserType, "firstName" | "lastName" | "age">
>;

export type UserUpdateByAdminDtoType = Partial<
    Omit<UserType, "_id" | "createdAt" | "updatedAt">
>;
export type UserLoginDtoType = Pick<UserType, "email" | "password">;
