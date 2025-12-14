import mongoose from "mongoose";

import { PlanTypeEnum } from "../enums/plan-type.enum";
import { UserType } from "../types/user.type";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        password: { type: String, required: true },
        email: { type: String, unique: true, required: true },
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
        planType: {
            type: String,
            enum: PlanTypeEnum,
            default: null,
        },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true, versionKey: false },
);

export const User = model<UserType>("users", userSchema);
