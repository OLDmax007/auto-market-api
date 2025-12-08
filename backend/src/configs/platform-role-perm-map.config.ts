import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";

export const platformRolePermissionsMap: Record<
    PlatformRoleEnum,
    PlatformPermissionEnum[]
> = {
    [PlatformRoleEnum.VISITOR]: [PlatformPermissionEnum.LISTING_CREATE],
    [PlatformRoleEnum.SELLER]: [
        PlatformPermissionEnum.LISTING_CREATE,
        PlatformPermissionEnum.LISTING_EDIT,
    ],
    [PlatformRoleEnum.MANAGER]: [
        PlatformPermissionEnum.LISTING_CREATE,
        PlatformPermissionEnum.LISTING_EDIT,
        PlatformPermissionEnum.LISTING_DELETE,
    ],
    [PlatformRoleEnum.ADMIN]: Object.values(PlatformPermissionEnum),
};
