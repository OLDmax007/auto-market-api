import { OrgRole, PlatformRole } from "../src/models";
import { platformRolePermissionsMap } from "../src/mappers/platform-role-perm.map";
import { orgRolePermissionsMap } from "../src/mappers/org-role-perm.map";

export const seedPermissionsAndRoles = async () => {

    for (const [roleName, perms] of Object.entries(platformRolePermissionsMap)) {
        const existingRole = await PlatformRole.findOne({ role: roleName });
        if (!existingRole) {
            await PlatformRole.create({
                role: roleName,
                permissions: perms,
                description: `Platform role: ${roleName}`,
            });
        } else {
            existingRole.permissions = perms;
            existingRole.description = `Platform role: ${roleName}`;
            await existingRole.save();
        }
    }

    for (const [roleName, perms] of Object.entries(orgRolePermissionsMap)) {
        const existingRole = await OrgRole.findOne({ role: roleName });
        if (!existingRole) {
            await OrgRole.create({
                role: roleName,
                permissions: perms,
                description: `Org role: ${roleName}`,
            });
        } else {
            existingRole.permissions = perms;
            existingRole.description = `Org role: ${roleName}`;
            await existingRole.save();
        }
    }

    console.log("✅ Idempotent seed completed: Permissions and Roles are safe!");
};