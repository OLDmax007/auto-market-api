import { OrgPermissionEnum } from "../enums/org-permission.enum";
import { OrgRoleEnum } from "../enums/org-role.enum";

export const orgRolePermissionsMap: Record<OrgRoleEnum, OrgPermissionEnum[]> = {
    [OrgRoleEnum.ORG_OWNER]: Object.values(OrgPermissionEnum),
    [OrgRoleEnum.ORG_ADMIN]: [
        OrgPermissionEnum.LISTING_CREATE,
        OrgPermissionEnum.LISTING_EDIT,
        OrgPermissionEnum.LISTING_DELETE,
    ],
    [OrgRoleEnum.ORG_MANAGER]: [
        OrgPermissionEnum.LISTING_CREATE,
        OrgPermissionEnum.LISTING_EDIT,
    ],
    [OrgRoleEnum.ORG_SELLER]: [OrgPermissionEnum.LISTING_CREATE],
};
