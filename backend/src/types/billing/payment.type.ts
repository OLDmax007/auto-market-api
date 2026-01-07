import { PaymentStatusEnum } from "../../enums/payment-status.enum";
import { BaseType, CurrencyType } from "../base.type";

export type PaymentType = {
    _id: string;
    userId: string;
    subscriptionId: string;
    price: CurrencyType;
    status: PaymentStatusEnum;
    paidAt: Date | null;
} & BaseType;

export type PaymentCreateType = Omit<
    PaymentType,
    "_id" | "createdAt" | "updatedAt"
>;
