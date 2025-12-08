import { PlanTypeEnum } from "../enums/plan-type.enum";
import { BaseType } from "./base.type";

export type OrganizationType = {
    _id: string;
    name: string;
    description?: string | null;
    ownerId: string;
    planType: PlanTypeEnum;
    address: {
        country: string;
        city: string;
        street: string;
    };
    isActive: boolean;
    deletedAt: Date | null;
} & BaseType;
