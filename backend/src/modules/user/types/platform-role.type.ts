import { BaseType } from "../../../common/types/base.type";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";

export type PlatformRoleType = {
    _id: string;
    role: PlatformRoleEnum;
    permissions: PlatformPermissionEnum[];
    description?: string;
} & BaseType;
