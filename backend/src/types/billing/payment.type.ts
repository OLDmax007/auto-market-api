import { PaymentStatusEnum } from "../../enums/payment-status.enum";
import { BaseType } from "../base.type";
import { CurrencyAmountType } from "../rate.type";

export type PaymentType = {
    _id: string;
    userId: string;
    subscriptionId: string;
    price: CurrencyAmountType;
    status: PaymentStatusEnum;
    paidAt: Date | null;
} & BaseType;

export type PaymentCreateType = Omit<
    PaymentType,
    "_id" | "createdAt" | "updatedAt"
>;
