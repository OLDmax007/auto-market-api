import { PlanTypeEnum } from "../enums/plan-type.enum";
import { BaseType } from "./base.type";

export type UserType = {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
    password: string;
    email: string;
    platformRoleId: string;
    organizationId: string;
    planType: PlanTypeEnum | null;
    isActive: boolean;
    isVerified: boolean;
    deletedAt: Date | null;
} & BaseType;

export type UserCreateDtoType = Pick<
    UserType,
    "firstName" | "lastName" | "age" | "email" | "password"
>;

export type UserCreateDbType = Pick<UserType, "platformRoleId" | "planType"> &
    UserCreateDtoType;
