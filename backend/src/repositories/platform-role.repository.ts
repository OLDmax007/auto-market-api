import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { PlatformRole } from "../models/permissions/platform-role.model";
import { PlatformRoleType } from "../types/permissions/platform-role.type";

class PlatformRoleRepository {
    public getById(roleId: string): Promise<PlatformRoleType> {
        return PlatformRole.findById(roleId);
    }

    public getByName(role: PlatformRoleEnum): Promise<PlatformRoleType> {
        return PlatformRole.findOne({
            role,
        });
    }
}

export const platformRoleRepository = new PlatformRoleRepository();
