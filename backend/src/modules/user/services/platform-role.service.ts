import NodeCache from "node-cache";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { platformRoleRepository } from "../repositories/platform-role.repository";
import { PlatformRoleType } from "../types/platform-role.type";

const roleCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

class PlatformRoleService {
    public async getPlatformRole(
        roleName: PlatformRoleEnum,
    ): Promise<PlatformRoleType> {
        const cachedRole = roleCache.get<PlatformRoleType>(roleName);
        if (cachedRole) return cachedRole;

        const role = await platformRoleRepository.getByName(roleName);

        if (!role) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Role not found");
        }

        roleCache.set(roleName, role);
        return role;
    }

    public async getPlatformRoleById(
        roleId: string,
    ): Promise<PlatformRoleType> {
        const role = await platformRoleRepository.getById(roleId);

        const cacheKey = `id_${roleId}`;
        const cachedRole = roleCache.get<PlatformRoleType>(cacheKey);

        if (cachedRole) return cachedRole;

        if (!role) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Role not found");
        }

        roleCache.set(cacheKey, role);
        return role;
    }
}

export const platformRoleService = new PlatformRoleService();
