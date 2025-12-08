import { PlatformRoleEnum } from "../../enums/platform-role.enum";
import { BaseType } from "../base.type";

export type PlatformRoleType = {
    _id: string;
    role: PlatformRoleEnum;
    permissionIds: string[];
    description?: string;
} & BaseType;
