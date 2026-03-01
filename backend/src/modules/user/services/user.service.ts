import { UploadedFile } from "express-fileupload";

import { DEFAULT_IMAGES_ENDPOINTS } from "../../../common/constants/default-images-endpoints.constants";
import { CurrencyEnum } from "../../../common/enums/currency.enum";
import { FileItemEnum } from "../../../common/enums/file-item.enum";
import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import {
    ensureEntityExists,
    ensureIsActive,
    ensureIsStatusSame,
} from "../../../common/helpers/ensure.helper";
import { getPaginationOptions } from "../../../common/helpers/pagination.helper";
import { s3Service } from "../../../common/services/s3.service";
import {
    PaginateFilterType,
    UserQueryType,
} from "../../../common/types/pagination.type";
import { listingRepository } from "../../listing/repositories/listing.repository";
import { pricingService } from "../../listing/services/pricing.service";
import { CurrencyAmountType } from "../../rate/rate.type";
import { subscriptionRepository } from "../../subscription/repositories/subscription.repository";
import { subscriptionService } from "../../subscription/subscription.service";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { userRepository } from "../repositories/user.repository";
import { UserCreateDtoType, UserType } from "../types/user.type";
import { platformRoleService } from "./platform-role.service";
import { userAccessService } from "./user-access.service";

class UserService {
    public async getAll(query: UserQueryType = {}): Promise<UserType[]> {
        const filter: PaginateFilterType = {};

        if (query.userId) {
            filter.userId = String(query.userId);
        }

        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === "true";
        }

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

    public async getPublicById(id: string): Promise<UserType> {
        const user = await this.getById(id);

        if (!user.isActive) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "User not found");
        }

        return user;
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
            if (!userAccessService.isSelfAction(user._id, initiatorId)) {
                const { role } = await platformRoleService.getPlatformRoleById(
                    user.platformRoleId,
                );

                userAccessService.checkIsStaff(role, initiatorRole);
                const isStaff = [
                    PlatformRoleEnum.ADMIN,
                    PlatformRoleEnum.MANAGER,
                ].includes(initiatorRole);
                if (!isStaff) {
                    userAccessService.checkAccountOwnership(
                        user._id,
                        initiatorId,
                    );
                }
            }

            return userRepository.updateById(user._id, dto);
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

        userAccessService.checkSelfAction(id, initiatorId);
        userAccessService.checkIsStaff(role, initiatorRole);

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
        userAccessService.checkSelfAction(id, initiatorId);
        userAccessService.checkIsStaff(role, initiatorRole);

        isActive
            ? await Promise.all([
                  subscriptionRepository.updateById(user.subscriptionId, {
                      isActive: true,
                  }),

                  listingRepository.activateManyByUserId(user._id),
              ])
            : await Promise.all([
                  subscriptionRepository.updateById(user.subscriptionId, {
                      isActive: false,
                  }),

                  listingRepository.deactivateManyByUserId(user._id),
              ]);

        return userRepository.updateById(id, {
            isActive,
        });
    }

    public async setPlatformRole(
        id: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        dto: { newRole: PlatformRoleEnum },
    ): Promise<UserType> {
        const user = await this.getById(id);

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        userAccessService.checkSelfAction(user._id, initiatorId);
        userAccessService.checkIsStaff(role, initiatorRole);
        const { _id } = await platformRoleService.getPlatformRole(dto.newRole);
        return userRepository.updateById(user._id, { platformRoleId: _id });
    }

    public async closeAccount(
        id: string,
        initiatorId: string,
        subscriptionId: string,
        isActive: boolean,
    ): Promise<UserType> {
        userAccessService.checkAccountOwnership(id, initiatorId);
        ensureIsActive(isActive, "User is already deactivated");
        await listingRepository.deactivateManyByUserId(id);
        await subscriptionRepository.updateById(subscriptionId, {
            isActive: false,
        });
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

    public async uploadAvatar(
        userId: string,
        file: UploadedFile,
    ): Promise<UserType> {
        const user = await this.getById(userId);

        if (user.avatar && user.avatar !== DEFAULT_IMAGES_ENDPOINTS.user) {
            await s3Service.deleteFile(user.avatar);
        }

        const avatar = await s3Service.uploadFile(
            file,
            FileItemEnum.USERS,
            userId,
        );
        return userRepository.updateById(userId, { avatar });
    }

    public async deleteAvatar(userId: string): Promise<UserType> {
        const user = await this.getById(userId);

        if (!user.avatar || user.avatar === DEFAULT_IMAGES_ENDPOINTS.user) {
            return user;
        }

        await s3Service.deleteFile(user.avatar);
        return userRepository.updateById(userId, {
            avatar: DEFAULT_IMAGES_ENDPOINTS.user,
        });
    }
}

export const userService = new UserService();
