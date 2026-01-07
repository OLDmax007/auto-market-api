import { PlanTypeEnum } from "../../enums/plan-type.enum";
import { BaseType, CurrencyType } from "../base.type";

export type SubscriptionType = {
    _id: string;
    userId: string;
    planType: PlanTypeEnum;
    price: CurrencyType;
    activeFrom: Date;
    activeTo: Date | null;
    isActive: boolean;
} & BaseType;

export type SubscriptionCreateType = Omit<
    SubscriptionType,
    "createdAt" | "updatedAt" | "_id"
>;
