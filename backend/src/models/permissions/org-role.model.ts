import { model, Schema } from "mongoose";

import { OrgPermissionEnum } from "../../enums/org-permission.enum";
import { OrgRoleEnum } from "../../enums/org-role.enum";
import { OrgRoleType } from "../../types/permissions/org-role.type";

const orgRoleSchema = new Schema(
    {
        role: {
            type: String,
            enum: OrgRoleEnum,
            required: true,
            default: OrgRoleEnum.ORG_OWNER,
        },
        permissions: [
            {
                type: String,
                enum: OrgPermissionEnum,
                required: true,
            },
        ],
        description: { type: String, default: null },
    },
    { timestamps: true, versionKey: false },
);

export const OrgRole = model<OrgRoleType>("organization-roles", orgRoleSchema);
