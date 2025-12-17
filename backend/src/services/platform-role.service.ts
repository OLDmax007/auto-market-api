import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { platformRoleRepository } from "../repositories/platform-role.repository";
import { PlatformRoleType } from "../types/permissions/platform-role.type";

class PlatformRoleService {
    public async getDefaultVisitor(): Promise<PlatformRoleType> {
        const role = await platformRoleRepository.getByName(
            PlatformRoleEnum.VISITOR,
        );

        if (!role) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Role not found");
        }

        return role;
    }
}

export const platformRoleService = new PlatformRoleService();
