import { PlanTypeEnum } from "../../enums/plan-type.enum";
import { BaseType } from "../base.type";

export type SubscriptionType = {
    _id: string;
    userId: string;
    planType: PlanTypeEnum;
    activeFrom: Date;
    activeTo: Date | null;
    isActive: boolean;
} & BaseType;
