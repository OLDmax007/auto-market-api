import mongoose from "mongoose";

import { SubscriptionPlanEnum } from "../../subscription/enums/subscription-plan.enum";
import { OrganizationType } from "../types/organization.type";

const { Schema, model } = mongoose;
const addressSchema = new Schema(
    {
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
    },
    { _id: false },
);

const organizationSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        description: { type: String, default: null },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
        planType: {
            type: String,
            enum: SubscriptionPlanEnum,
            default: SubscriptionPlanEnum.BASIC,
        },
        address: { type: addressSchema, required: true },
        isActive: { type: Boolean, default: true, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const Organization = model<OrganizationType>(
    "organizations",
    organizationSchema,
);
