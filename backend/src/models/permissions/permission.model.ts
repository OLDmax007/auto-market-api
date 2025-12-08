import mongoose from "mongoose";

import { OrgPermissionEnum } from "../../enums/org-permission.enum";
import { PlatformPermissionEnum } from "../../enums/platform-permission.enum";
import { PermissionType } from "../../types/permissions/permission.type";

const { Schema, model } = mongoose;

const permissionSchema = new Schema(
    {
        name: {
            type: String,
            enum: [
                ...Object.values(OrgPermissionEnum),
                ...Object.values(PlatformPermissionEnum),
            ],
            required: true,
            unique: true,
            uppercase: true,
        },
        description: { type: String, default: null },
    },
    { timestamps: true, versionKey: false },
);

export const Permission = model<PermissionType>(
    "permissions",
    permissionSchema,
);
