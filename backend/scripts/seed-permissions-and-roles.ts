import {OrgRole, Permission, PlatformRole} from "../src/models";
import {PlatformPermissionEnum} from "../src/enums/platform-permission.enum";
import {OrgPermissionEnum} from "../src/enums/org-permission.enum";
import {platformRolePermissionsMap} from "../src/mappers/platform-role-perm.map";
import {orgRolePermissionsMap} from "../src/mappers/org-role-perm.map";

export const seedPermissionsAndRoles = async () => {
    await Permission.deleteMany({});
    await OrgRole.deleteMany({});
    await PlatformRole.deleteMany({});

    const allPermNames = [
        ...Object.values(PlatformPermissionEnum),
        ...Object.values(OrgPermissionEnum),
    ];

    await Permission.insertMany(allPermNames.map(name => ({ name })));

    const platformRolesData = Object.entries(platformRolePermissionsMap).map(([role, perms]) => ({
        role,
        permissions: perms,
        description: `Platform role: ${role}`
    }));

    const orgRolesData = Object.entries(orgRolePermissionsMap).map(([role, perms]) => ({
        role,
        permissions: perms,
        description: `Org role: ${role}`
    }));

    await Promise.all([
        PlatformRole.insertMany(platformRolesData),
        OrgRole.insertMany(orgRolesData)
    ]);

    console.log("✅ Roles (with string names) and Permission reference seeded!");
};