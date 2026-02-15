import mongoose from "mongoose";

import { PlatformPermissionEnum } from "../../enums/platform-permission.enum";
import { PlatformRoleEnum } from "../../enums/platform-role.enum";
import { PlatformRoleType } from "../../types/permissions/platform-role.type";

const { Schema, model } = mongoose;

const platformRoleSchema = new Schema(
    {
        role: {
            type: String,
            enum: PlatformRoleEnum,
            required: true,
            default: PlatformRoleEnum.VISITOR,
        },
        permissions: [
            {
                type: String,
                enum: PlatformPermissionEnum,
                required: true,
            },
        ],
        description: { type: String, default: null },
    },
    { timestamps: true, versionKey: false },
);

export const PlatformRole = model<PlatformRoleType>(
    "platform-roles",
    platformRoleSchema,
);
