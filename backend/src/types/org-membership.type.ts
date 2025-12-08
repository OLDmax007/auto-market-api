import { BaseType } from "./base.type";

export type OrgMembershipType = {
    _id: string;
    organizationId: string;
    userId: string;
    orgRoleId: string;
    isActive: boolean;
    joinedAt: Date;
    invitedAt: Date | null;
    deletedAt: Date | null;
} & BaseType;
