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
    isActive: boolean;
    isVerified: boolean;
    deletedAt: Date | null;
} & BaseType;
