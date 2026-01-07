import { BaseType, CurrencyType } from "./base.type";

export type UserType = {
    _id: string;
    platformRoleId: string;
    organizationId: string;
    subscriptionId?: string;
    firstName: string;
    lastName: string;
    age: number;
    password: string;
    email: string;
    balance: CurrencyType;
    isActive: boolean;
    isVerified: boolean;
    deletedAt: Date | null;
} & BaseType;

export type UserCreateDtoType = Pick<
    UserType,
    "firstName" | "lastName" | "age" | "email" | "password"
>;

export type UserCreateDbType = Pick<UserType, "platformRoleId"> &
    UserCreateDtoType;

export type UserLoginDtoType = Pick<UserType, "email" | "password">;
