import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { UserCreateDtoType, UserType } from "../types/user.type";
import { platformRoleService } from "./platform-role.service";

class UserService {
    public getAll(): Promise<UserType[]> {
        return userRepository.getAll();
    }

    public getById(id: string): Promise<UserType> {
        const user = userRepository.getById(id);

        if (!user) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "User not found");
        }
        return user;
    }

    public async create(dto: UserCreateDtoType): Promise<UserType> {
        const { _id } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.VISITOR,
        );

        return userRepository.create({
            platformRoleId: _id,
            planType: PlanTypeEnum.BASIC,
            ...dto,
        });
    }

    public async becomeSeller(id: string): Promise<UserType> {
        const { _id: sellerRoleId } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.SELLER,
        );

        const user = await this.getById(id);

        if (String(user.platformRoleId) === String(sellerRoleId)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User is already seller",
            );
        }
        const updatedUser = await userRepository.updateById(id, sellerRoleId);

        return updatedUser;
    }
}

export const userService = new UserService();
