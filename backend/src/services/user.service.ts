import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { ensureEntityExists } from "../helpers/ensure-entity.helper";
import { userRepository } from "../repositories/user.repository";
import { CurrencyAmountType } from "../types/rate.type";
import {
    UserCreateDtoType,
    UserType,
    UserUpdateByAdminDtoType,
    UserUpdateDtoType,
} from "../types/user.type";
import { listingService } from "./listing.service";
import { passwordService } from "./password.service";
import { platformRoleService } from "./platform-role.service";
import { pricingService } from "./pricing.service";

class UserService {
    public getAll(): Promise<UserType[]> {
        return userRepository.getAll();
    }

    public async getManyByPlatformId(
        platformRoleId: string,
    ): Promise<UserType[]> {
        const users = await userRepository.getManyByPlatformId(platformRoleId);

        if (!users.length) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Users not found");
        }
        return users;
    }

    public async getById(id: string): Promise<UserType> {
        const user = await userRepository.getById(id);
        return ensureEntityExists<UserType>(user, "User not found");
    }

    public async getByEmail(email: string): Promise<UserType> {
        const user = await userRepository.getByEmail(email);
        return ensureEntityExists<UserType>(user, "User not found");
    }

    public async create(dto: UserCreateDtoType): Promise<UserType> {
        const { _id } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.VISITOR,
        );

        return userRepository.create({
            platformRoleId: _id,
            ...dto,
        });
    }

    public async update(
        id: string,
        dto: UserUpdateDtoType | UserUpdateByAdminDtoType,
    ): Promise<UserType> {
        await this.getById(id);

        const updateData = { ...dto };

        if (updateData.password) {
            updateData.password = await passwordService.hashPassword(
                updateData.password,
            );
        }

        return userRepository.updateById(id, updateData);
    }

    public async updateMe(
        id: string,
        dto: UserUpdateDtoType,
    ): Promise<UserType> {
        await this.getById(id);
        return this.update(id, dto);
    }

    public async updateByAdmin(
        id: string,
        dto: UserUpdateByAdminDtoType,
    ): Promise<UserType> {
        await this.getById(id);
        return this.update(id, dto);
    }

    public async deleteById(id: string): Promise<UserType> {
        const user = await this.getById(id);
        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        if (role === PlatformRoleEnum.ADMIN) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "You cannot delete a user with Administrator privileges",
            );
        }
        await listingService.deactivateManyByUserId(id);

        return userRepository.deleteById(id);
    }

    public async activateUser(id: string): Promise<UserType> {
        const user = await this.getById(id);

        if (user.isActive) {
            return user;
        }

        return userRepository.updateById(id, {
            isActive: true,
        });
    }

    public async deactivateUser(id: string): Promise<UserType> {
        const user = await this.getById(id);

        if (!user.isActive) {
            return user;
        }

        await listingService.deactivateManyByUserId(id);

        return userRepository.updateById(id, {
            isActive: false,
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
        return userRepository.updateById(id, {
            platformRoleId: sellerRoleId,
        });
    }

    public async checkEmailUniqueness(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError(
                HttpStatusEnum.CONFLICT,
                "User already is exists",
            );
        }
    }

    public async topUpBalance(
        id: string,
        { amount, currency }: CurrencyAmountType,
    ): Promise<{ balance: CurrencyAmountType; credited: CurrencyAmountType }> {
        let { balance } = await userService.getById(id);

        const convertedMoney = await pricingService.convertToUAH(
            amount,
            currency,
        );

        balance.amount += convertedMoney;

        await userRepository.updateById(id, {
            balance: {
                amount: balance.amount,
                currency: CurrencyEnum.UAH,
            },
        });

        return { balance, credited: { amount, currency } };
    }
}

export const userService = new UserService();
