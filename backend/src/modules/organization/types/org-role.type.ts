import { BaseType } from "../../../common/types/base.type";
import { OrgPermissionEnum } from "../enums/org-permission.enum";
import { OrgRoleEnum } from "../enums/org-role.enum";

export type OrgRoleType = {
    _id: string;
    role: OrgRoleEnum;
    permissions: OrgPermissionEnum[];
    description?: string;
} & BaseType;
