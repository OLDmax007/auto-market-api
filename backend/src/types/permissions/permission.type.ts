import { OrgPermissionEnum } from "../../enums/org-permission.enum";
import { PlatformPermissionEnum } from "../../enums/platform-permission.enum";
import { BaseType } from "../base.type";

export type PermissionType = {
    _id: string;
    name: PlatformPermissionEnum | OrgPermissionEnum;
    description?: string;
} & BaseType;
