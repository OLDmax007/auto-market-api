import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { platformRoleRepository } from "../repositories/platform-role.repository";
import { userRepository } from "../repositories/user.repository";
import { UserCreateDtoType, UserType } from "../types/user.type";

class UserService {
    public getAll(): Promise<UserType[]> {
        return userRepository.getAll();
    }

    public getById(id: string): Promise<UserType> {
        return userRepository.getById(id);
    }

    public async create(dto: UserCreateDtoType): Promise<UserType> {
        const role = await platformRoleRepository.getByName(
            PlatformRoleEnum.VISITOR,
        );

        if (!role) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Role not found");
        }

        const user = await userRepository.create({
            platformRoleId: role._id,
            planType: PlanTypeEnum.BASIC,
            ...dto,
        });

        return user;
    }
}

export const userService = new UserService();
