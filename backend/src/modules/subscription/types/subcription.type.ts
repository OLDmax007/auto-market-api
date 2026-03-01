import { BaseType } from "../../../common/types/base.type";
import { CurrencyAmountType } from "../../rate/rate.type";
import { SubscriptionPlanEnum } from "../enums/subscription-plan.enum";

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
