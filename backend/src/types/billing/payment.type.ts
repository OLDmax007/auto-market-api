import { PaymentStatusEnum } from "../../enums/payment-status.enum";
import { PlanTypeEnum } from "../../enums/plan-type.enum";
import { BaseType } from "../base.type";

export type PaymentType = {
    _id: string;
    userId: string;
    planType: PlanTypeEnum;
    amount: number;
    status: PaymentStatusEnum;
    paidAt: Date | null;
} & BaseType;
