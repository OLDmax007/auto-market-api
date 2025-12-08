import {OrgPermissionEnum} from "../src/enums/org-permission.enum";
import {PlatformPermissionEnum} from "../src/enums/platform-permission.enum";
import {OrgRole} from "../src/models/permissions/org-role.model";
import {Permission} from "../src/models/permissions/permission.model";
import {PlatformRole} from "../src/models/permissions/platform-role.model";
import {dataBaseService} from "../src/services/database.service";
import {orgRolePermissionsMap} from "../src/configs/org-role-perm-map.config";
import {platformRolePermissionsMap} from "../src/configs/platform-role-perm-map.config";

const seedPermissionsAndRoles = async () => {
    await Permission.deleteMany({});
    await OrgRole.deleteMany({});
    await PlatformRole.deleteMany({});

    const allPermissions = [
        ...Object.values(PlatformPermissionEnum).map((p) => ({ name: p })),
        ...Object.values(OrgPermissionEnum).map((p) => ({ name: p })),
    ];

    const permissions = await Permission.create(allPermissions);

    const permissionsMap = permissions.reduce(
        (acc, p) => {
            acc[p.name] = p._id;
            return acc;
        },
        {} as Record<PlatformPermissionEnum | OrgPermissionEnum, string>,
    );


    for (const [role, permissions] of Object.entries(platformRolePermissionsMap)) {
        const permissionIds = permissions
            .map((p) => permissionsMap[p as PlatformPermissionEnum])
            .filter(Boolean);
        await PlatformRole.findOneAndUpdate(
            { role },
            { $set: { permissionIds, description: `Platform role: ${role}` } },
            { upsert: true }
        )
    }

    for (const [role, permissions] of Object.entries(orgRolePermissionsMap)) {
        const permissionIds = permissions
            .map((p) => permissionsMap[p as OrgPermissionEnum])
            .filter(Boolean);
        await OrgRole.findOneAndUpdate(
            { role },
            { $set: { permissionIds, description: `Org role: ${role}` } },
            { upsert: true }
        )
    }

    console.log("Roles and permissions seeded successfully");
};

(async () => {
    try {
        await dataBaseService.connectToDB();
        await seedPermissionsAndRoles();
        await dataBaseService.disconnectDB();
        console.log("DONE!!!");
    } catch (err) {
        console.error(err);
    }
})();
