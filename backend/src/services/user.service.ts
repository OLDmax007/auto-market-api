import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { ensureEntityExists } from "../helpers/ensure-entity.helper";
import { getPaginationOptions } from "../helpers/pagination.helper";
import { listingRepository } from "../repositories/listing.repository";
import { userRepository } from "../repositories/user.repository";
import { PaginateFilterType, QueryType } from "../types/pagination.type";
import { CurrencyAmountType } from "../types/rate.type";
import {
    UserCreateDtoType,
    UserType,
    UserUpdateByAdminDtoType,
    UserUpdateDtoType,
} from "../types/user.type";
import { passwordService } from "./password.service";
import { platformRoleService } from "./platform-role.service";
import { pricingService } from "./pricing.service";

class UserService {
    public async getAll(query: QueryType = {}): Promise<UserType[]> {
        const filter: PaginateFilterType = {};
        if (query.search) {
            filter.$or = [
                { firstName: { $regex: query.search, $options: "i" } },
                { lastName: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
            ];
        }

        const options = getPaginationOptions(query);

        const { docs } = await userRepository.getAllPaginated(filter, {
            ...options,
            select: "",
        });
        return docs;
    }

    public async getById(id: string): Promise<UserType> {
        const user = await userRepository.getById(id);
        return ensureEntityExists<UserType>(user, "User not found");
    }

    public async getByEmail(
        email: string,
        errorMessage = "User not found",
    ): Promise<UserType> {
        const user = await userRepository.getByEmail(email);
        return ensureEntityExists<UserType>(user, errorMessage);
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

    public async updateMe(
        id: string,
        dto: UserUpdateDtoType,
    ): Promise<UserType> {
        return userRepository.updateById(id, dto);
    }

    public async updateByAdmin(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        dto: UserUpdateByAdminDtoType,
    ): Promise<UserType> {
        const user = await this.getTargetUserWithHierarchyCheck(
            id,
            initiatorId,
            initiatorRole,
            "update",
        );

        if (dto.password) {
            dto.password = await passwordService.hashPassword(dto.password);
        }
        return userRepository.updateById(user._id, dto);
    }

    public async deleteById(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
    ): Promise<UserType> {
        const user = await this.getTargetUserWithHierarchyCheck(
            id,
            initiatorId,
            initiatorRole,
            "delete",
        );

        await listingRepository.deleteAllByUserId(user._id);

        return userRepository.deleteById(user._id);
    }

    public async activateUser(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
    ): Promise<UserType> {
        const user = await this.getTargetUserWithHierarchyCheck(
            id,
            initiatorId,
            initiatorRole,
            "activate",
        );

        if (user.isActive) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User account is already activated.",
            );
        }
        await listingRepository.activateCleanByUserId(user._id);

        return userRepository.updateById(id, {
            isActive: true,
        });
    }

    public async deactivateUser(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
    ): Promise<UserType> {
        const user = await this.getTargetUserWithHierarchyCheck(
            id,
            initiatorId,
            initiatorRole,
            "deactivate",
        );

        if (!user.isActive) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User account is already deactivated.",
            );
        }

        await listingRepository.deactivateByUserId(user._id);

        return userRepository.updateById(id, {
            isActive: false,
        });
    }

    public async becomeSeller(
        id: string,
        currentPlatformRoleId: string,
    ): Promise<UserType> {
        const { _id: sellerRoleId } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.SELLER,
        );

        if (String(currentPlatformRoleId) === String(sellerRoleId)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User is already seller",
            );
        }

        return userRepository.updateById(id, {
            platformRoleId: sellerRoleId,
        });
    }

    public async topUpBalance(
        id: string,
        currentBalance: CurrencyAmountType,
        { amount, currency }: CurrencyAmountType,
    ): Promise<{ balance: CurrencyAmountType; credited: CurrencyAmountType }> {
        const convertedMoney = await pricingService.convertToUAH(
            amount,
            currency,
        );

        const updatedBalance = {
            amount: currentBalance.amount + convertedMoney,
            currency: CurrencyEnum.UAH,
        };

        await userRepository.updateById(id, {
            balance: updatedBalance,
        });

        return { balance: updatedBalance, credited: { amount, currency } };
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

    public checkIsActive(isActive: boolean): void {
        if (!isActive) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "User account is suspended",
            );
        }
    }

    private checkNotSelfAction(
        currentId: string,
        initiatorId: string,
        action: string,
    ): void {
        if (currentId === initiatorId) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Access denied: You cannot ${action} your own account via this method`,
            );
        }
    }

    private async getTargetUserWithHierarchyCheck(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        action: string,
    ): Promise<UserType> {
        this.checkNotSelfAction(id, initiatorId, action);

        const user = await this.getById(id);

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        if (role === PlatformRoleEnum.ADMIN) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `Access denied: Cannot ${action} an Administrator`,
            );
        }

        if (
            initiatorRole === PlatformRoleEnum.MANAGER &&
            role === PlatformRoleEnum.MANAGER
        ) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `Access denied: Managers cannot ${action} other Managers`,
            );
        }

        return user;
    }
}

export const userService = new UserService();
