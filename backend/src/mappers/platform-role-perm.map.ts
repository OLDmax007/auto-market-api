import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";

export const platformRolePermissionsMap: Record<
    PlatformRoleEnum,
    PlatformPermissionEnum[]
> = {
    [PlatformRoleEnum.VISITOR]: [
        PlatformPermissionEnum.ME_GET,
        PlatformPermissionEnum.ME_BECOME_SELLER,
        PlatformPermissionEnum.ME_DEACTIVATE,
        PlatformPermissionEnum.ME_UPDATE,
    ],
    [PlatformRoleEnum.SELLER]: [
        PlatformPermissionEnum.ME_GET,
        PlatformPermissionEnum.ME_UPDATE,
        PlatformPermissionEnum.ME_TOP_UP,
        PlatformPermissionEnum.ME_BECOME_SELLER,
        PlatformPermissionEnum.ME_UPGRADE_PLAN,
        PlatformPermissionEnum.LISTING_CREATE,
        PlatformPermissionEnum.LISTING_EDIT,
        PlatformPermissionEnum.LISTING_GET_STATS,
        PlatformPermissionEnum.ME_DEACTIVATE,
        PlatformPermissionEnum.ME_LISTING_DEACTIVATE,
        PlatformPermissionEnum.LISTING_CLOSE,
        PlatformPermissionEnum.LISTING_GET_MY_BY_ID,
    ],
    [PlatformRoleEnum.MANAGER]: [
        PlatformPermissionEnum.ME_GET,
        PlatformPermissionEnum.ME_UPDATE,
        PlatformPermissionEnum.LISTING_EDIT,
        PlatformPermissionEnum.LISTING_ACTIVATE,
        PlatformPermissionEnum.LISTING_DEACTIVATE,
        PlatformPermissionEnum.LISTING_GET_STATS,
        PlatformPermissionEnum.LISTING_GET_ALL_BY_MODERATION,
        PlatformPermissionEnum.LISTING_GET_BY_MODERATION,
        PlatformPermissionEnum.USER_GET_ALL,
        PlatformPermissionEnum.USER_ACTIVATE,
        PlatformPermissionEnum.USER_DEACTIVATE,
    ],
    [PlatformRoleEnum.ADMIN]: Object.values(PlatformPermissionEnum).filter(
        (permission) => permission !== PlatformPermissionEnum.ME_DEACTIVATE,
    ),
};
