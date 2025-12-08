import mongoose from "mongoose";

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
        permissionIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Permission",
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
