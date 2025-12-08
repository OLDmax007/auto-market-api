import { OrgRoleEnum } from "../../enums/org-role.enum";
import { BaseType } from "../base.type";

export type OrgRoleType = {
    _id: string;
    role: OrgRoleEnum;
    permissionIds: string[];
    description?: string;
} & BaseType;
