import { PlanTypeEnum } from "../enums/plan-type.enum";
import { userRepository } from "../repositories/user.repository";
import { UserCreateDtoType, UserType } from "../types/user.type";
import { platformRoleService } from "./platform-role.service";

class UserService {
    public getAll(): Promise<UserType[]> {
        return userRepository.getAll();
    }

    public getById(id: string): Promise<UserType> {
        return userRepository.getById(id);
    }

    public async create(dto: UserCreateDtoType): Promise<UserType> {
        const { _id } = await platformRoleService.getDefaultVisitor();

        return userRepository.create({
            platformRoleId: _id,
            planType: PlanTypeEnum.BASIC,
            ...dto,
        });
    }
}

export const userService = new UserService();
