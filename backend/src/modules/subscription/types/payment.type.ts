import { BaseType } from "../../../common/types/base.type";
import { CurrencyAmountType } from "../../rate/rate.type";
import { PaymentStatusEnum } from "../enums/payment-status.enum";

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
