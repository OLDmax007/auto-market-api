import mongoose from "mongoose";

import { CurrencyEnum } from "../enums/currency.enum";
import { UserType } from "../types/user.type";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        password: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        balance: {
            amount: { type: Number, default: 0 },
            currency: { type: String, default: CurrencyEnum.UAH },
        },
        platformRoleId: {
            type: Schema.Types.ObjectId,
            ref: "PlatformRole",
            required: true,
        },
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },
        subscriptionId: {
            type: Schema.Types.ObjectId,
            ref: "Subscription",
            default: null,
        },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false },
);

export const User = model<UserType>("users", userSchema);
