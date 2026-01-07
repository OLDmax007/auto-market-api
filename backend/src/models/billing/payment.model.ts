import mongoose from "mongoose";

import { CurrencyEnum } from "../../enums/currency.enum";
import { PaymentStatusEnum } from "../../enums/payment-status.enum";
import { PaymentType } from "../../types/billing/payment.type";

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subscriptionId: {
            type: Schema.Types.ObjectId,
            ref: "Subscription",
            required: true,
        },
        price: {
            amount: { type: Number, default: 0 },
            currency: { type: String, default: CurrencyEnum.UAH },
        },
        status: {
            type: String,
            enum: PaymentStatusEnum,
            default: PaymentStatusEnum.SUCCESS,
        },
        paidAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Payment = model<PaymentType>("payments", paymentSchema);
