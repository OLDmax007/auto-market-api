import mongoose from "mongoose";

import { CurrencyEnum } from "../../enums/currency.enum";
import { SubscriptionPlanEnum } from "../../enums/subscription-plan.enum";
import { SubscriptionType } from "../../types/billing/subcription.type";

const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        planType: {
            type: String,
            enum: SubscriptionPlanEnum,
            default: SubscriptionPlanEnum.BASIC,
        },

        price: {
            amount: { type: Number, default: 0 },
            currency: { type: String, default: CurrencyEnum.UAH },
        },

        activeFrom: {
            type: Date,
            default: Date.now,
        },

        activeTo: {
            type: Date,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Subscription = model<SubscriptionType>(
    "subscriptions",
    subscriptionSchema,
);
