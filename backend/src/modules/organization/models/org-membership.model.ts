import mongoose from "mongoose";

import { OrgMembershipType } from "../types/org-membership.type";

const { Schema, model } = mongoose;
const orgMembershipSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            unique: true,
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },

        orgRoleId: {
            type: Schema.Types.ObjectId,
            ref: "OrgRole",
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },

        invitedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true, versionKey: false },
);

export const OrgMembership = model<OrgMembershipType>(
    "organization-memberships",
    orgMembershipSchema,
);
