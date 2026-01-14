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
