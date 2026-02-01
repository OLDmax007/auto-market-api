import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { platformRoleRepository } from "../repositories/platform-role.repository";
import { PlatformRoleType } from "../types/permissions/platform-role.type";

class PlatformRoleService {
    public async getPlatformRole(
        roleName: PlatformRoleEnum,
    ): Promise<PlatformRoleType> {
        const role = await platformRoleRepository.getByName(roleName);

        if (!role) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Role not found");
        }

        return role;
    }

    public async getPlatformRoleById(
        roleId: string,
    ): Promise<PlatformRoleType> {
        const role = await platformRoleRepository.getById(roleId);

        if (!role) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Role not found");
        }

        return role;
    }
}

export const platformRoleService = new PlatformRoleService();
