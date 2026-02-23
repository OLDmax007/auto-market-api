import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import {
    ensureEntityExists,
    ensureIsActive,
    ensureIsStatusSame,
} from "../helpers/ensure.helper";
import { getPaginationOptions } from "../helpers/pagination.helper";
import { listingRepository } from "../repositories/listing.repository";
import { userRepository } from "../repositories/user.repository";
import { PaginateFilterType, QueryType } from "../types/pagination.type";
import { CurrencyAmountType } from "../types/rate.type";
import { UserCreateDtoType, UserType } from "../types/user.type";
import { platformRoleService } from "./platform-role.service";
import { pricingService } from "./pricing.service";
import { subscriptionService } from "./subscription.service";
import { userAccessService } from "./user-access.service";

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

    public async updateByRole(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        dto: Partial<UserType>,
    ): Promise<UserType> {
        const user = await userService.getById(id);
        if (userAccessService.isSelfAction(user._id, initiatorId)) {
            userAccessService.checkAccountOwnership(user._id, initiatorId);
        } else {
            const { role } = await platformRoleService.getPlatformRoleById(
                user.platformRoleId,
            );

            userAccessService.checkAccessRights(
                user._id,
                initiatorId,
                initiatorRole,
            );
            userAccessService.checkIsStaff(role, initiatorRole);
        }

        return userRepository.updateById(user._id, dto);
    }

    public async deleteById(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
    ): Promise<void> {
        const user = await userService.getById(id);

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        userAccessService.checkIsStaff(role, initiatorRole);
        userAccessService.checkSelfAction(id, initiatorId);

        await subscriptionService.deleteById(user.subscriptionId);
        await listingRepository.deleteAllByUserId(user._id);
        await userRepository.deleteById(user._id);
    }

    public async setStatusByRole(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        isActive: boolean,
    ) {
        const user = await userService.getById(id);
        ensureIsStatusSame(
            user.isActive,
            isActive,
            `User is already ${user.isActive ? "activated" : "deactivated"} `,
        );
        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );
        userAccessService.checkIsStaff(role, initiatorRole);
        userAccessService.checkSelfAction(id, initiatorId);

        isActive
            ? await listingRepository.activateCleanByUserId(user._id)
            : await listingRepository.deactivateByUserId(user._id);

        return userRepository.updateById(id, {
            isActive,
        });
    }

    public async closeAccount(
        id: string,
        initiatorId: string,
        isActive: boolean,
    ): Promise<UserType> {
        userAccessService.checkAccountOwnership(id, initiatorId);
        ensureIsActive(isActive, "User is already deactivated");
        await listingRepository.deactivateByUserId(id);
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

        const newTotalAmount = Number(
            (currentBalance.amount + convertedMoney).toFixed(2),
        );

        const updatedBalance = {
            amount: newTotalAmount,
            currency: CurrencyEnum.UAH,
        };

        await userRepository.updateById(id, {
            balance: updatedBalance,
        });

        return {
            balance: updatedBalance,
            credited: { amount: Number(amount.toFixed(2)), currency },
        };
    }
}

export const userService = new UserService();
