import { PlatformPermissionEnum } from "../../enums/platform-permission.enum";
import { PlatformRoleEnum } from "../../enums/platform-role.enum";
import { BaseType } from "../base.type";

export type PlatformRoleType = {
    _id: string;
    role: PlatformRoleEnum;
    permissions: PlatformPermissionEnum[];
    description?: string;
} & BaseType;
