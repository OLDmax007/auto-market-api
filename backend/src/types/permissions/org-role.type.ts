import { OrgPermissionEnum } from "../../enums/org-permission.enum";
import { OrgRoleEnum } from "../../enums/org-role.enum";
import { BaseType } from "../base.type";

export type OrgRoleType = {
    _id: string;
    role: OrgRoleEnum;
    permissions: OrgPermissionEnum[];
    description?: string;
} & BaseType;
