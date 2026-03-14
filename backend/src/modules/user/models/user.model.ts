import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { DEFAULT_IMAGES_ENDPOINTS } from "../../../common/constants/default-images-endpoints.constants";
import { CurrencyEnum } from "../../../common/enums/currency.enum";
import { UserType } from "../types/user.type";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
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
        avatar: {
            type: String,
            default: DEFAULT_IMAGES_ENDPOINTS.user,
        },
        isActive: { type: Boolean, default: true },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false },
);

userSchema.index(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false },
    },
);

userSchema.plugin(mongoosePaginate);

export const User = model<UserType, PaginateModel<UserType>>(
    "users",
    userSchema,
);
