import { BaseType } from "../../../common/types/base.type";
import { SubscriptionPlanEnum } from "../../subscription/enums/subscription-plan.enum";

export type OrganizationType = {
    _id: string;
    name: string;
    description?: string | null;
    ownerId: string;
    planType: SubscriptionPlanEnum;
    address: {
        country: string;
        city: string;
        street: string;
    };
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
} & BaseType;
