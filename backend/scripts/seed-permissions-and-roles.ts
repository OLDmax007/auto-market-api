import {orgRolePermissionsMap} from "../src/modules/organization/org-role-perm.map";
import {OrgRole} from "../src/modules/organization/models/org-role.model";
import {PlatformRole} from "../src/modules/user/models/platform-role.model";
import {platformRolePermissionsMap} from "../src/modules/user/platform-role-perm.map";


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