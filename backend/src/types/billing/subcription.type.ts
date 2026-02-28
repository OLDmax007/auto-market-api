import { SubscriptionPlanEnum } from "../../enums/subscription-plan.enum";
import { BaseType } from "../base.type";
import { CurrencyAmountType } from "../rate.type";

export type SubscriptionType = {
    _id: string;
    userId: string;
    planType: SubscriptionPlanEnum;
    price: CurrencyAmountType;
    activeFrom: Date;
    activeTo: Date | null;
    isActive: boolean;
} & BaseType;

export type SubscriptionCreateType = Pick<SubscriptionType, "userId">;
