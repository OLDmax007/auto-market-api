import { PlatformPermissionEnum } from "./enums/platform-permission.enum";
import { PlatformRoleEnum } from "./enums/platform-role.enum";

export const platformRolePermissionsMap: Record<
    PlatformRoleEnum,
    PlatformPermissionEnum[]
> = {
    [PlatformRoleEnum.VISITOR]: [
        PlatformPermissionEnum.ME_GET,
        PlatformPermissionEnum.ME_EDIT,
        PlatformPermissionEnum.ME_BECOME_SELLER,
        PlatformPermissionEnum.ME_DEACTIVATE,
    ],
    [PlatformRoleEnum.SELLER]: [
        PlatformPermissionEnum.ME_GET,
        PlatformPermissionEnum.ME_EDIT,
        PlatformPermissionEnum.ME_TOP_UP,
        PlatformPermissionEnum.ME_BECOME_SELLER,
        PlatformPermissionEnum.ME_UPGRADE_PLAN,
        PlatformPermissionEnum.ME_DEACTIVATE,
        PlatformPermissionEnum.ME_LISTING_DEACTIVATE,
        PlatformPermissionEnum.ME_UPLOAD_AVATAR,
        PlatformPermissionEnum.ME_DELETE_AVATAR,
        PlatformPermissionEnum.LISTING_CREATE,
        PlatformPermissionEnum.LISTING_EDIT,
        PlatformPermissionEnum.LISTING_GET_STATS,
        PlatformPermissionEnum.LISTING_CLOSE,
        PlatformPermissionEnum.LISTING_GET_MY,
        PlatformPermissionEnum.LISTING_GET_MY_ALL,
        PlatformPermissionEnum.LISTING_UPLOAD_POSTER,
        PlatformPermissionEnum.LISTING_DELETE_POSTER,
        PlatformPermissionEnum.CAR_MISSING_REPORT,
    ],
    [PlatformRoleEnum.MANAGER]: [
        PlatformPermissionEnum.ME_GET,
        PlatformPermissionEnum.ME_EDIT,
        PlatformPermissionEnum.ME_UPLOAD_AVATAR,
        PlatformPermissionEnum.ME_DELETE_AVATAR,
        PlatformPermissionEnum.LISTING_EDIT_BY_MANAGER,
        PlatformPermissionEnum.LISTING_ACTIVATE,
        PlatformPermissionEnum.LISTING_DEACTIVATE,
        PlatformPermissionEnum.LISTING_GET_STATS,
        PlatformPermissionEnum.LISTING_GET_ALL_FOR_STAFF,
        PlatformPermissionEnum.LISTING_GET_BY_ID_FOR_STAFF,
        PlatformPermissionEnum.USER_GET_ALL_FOR_STAFF,
        PlatformPermissionEnum.USER_GET_BY_ID_FOR_STAFF,
        PlatformPermissionEnum.USER_ACTIVATE,
        PlatformPermissionEnum.USER_DEACTIVATE,
        PlatformPermissionEnum.CAR_MISSING_REPORT,
    ],
    [PlatformRoleEnum.ADMIN]: Object.values(PlatformPermissionEnum),
};
