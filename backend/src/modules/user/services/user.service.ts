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
import { emailService } from "../../../common/services/email.service";
import { s3Service } from "../../../common/services/s3.service";
import {
    PaginatedResponseType,
    PaginateFilterType,
    UserQueryType,
} from "../../../common/types/pagination.type";
import { listingRepository } from "../../listing/repositories/listing.repository";
import { pricingService } from "../../listing/services/pricing.service";
import { CurrencyAmountType } from "../../rate/rate.type";
import { subscriptionRepository } from "../../subscription/repositories/subscription.repository";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { userRepository } from "../repositories/user.repository";
import {
    UserCreateDtoType,
    UserInitiatorType,
    UserType,
    UserUpdateByAdminDtoType,
    UserUpdateDtoType,
} from "../types/user.type";
import { platformRoleService } from "./platform-role.service";
import { userAccessService } from "./user-access.service";

class UserService {
    public async getAll(
        query: UserQueryType = {},
    ): Promise<PaginatedResponseType<UserType>> {
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

        return userRepository.getAllPaginated(filter, {
            ...options,
            select: "",
        });
    }

    public async getById(userId: string): Promise<UserType> {
        const user = await userRepository.getById(userId);
        return ensureEntityExists<UserType>(user, "User not found");
    }

    public async getPublicById(userId: string): Promise<UserType> {
        const user = await this.getById(userId);

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

    public async updateMe(
        userId: string,
        dto: UserUpdateDtoType,
    ): Promise<UserType> {
        const user = await this.getById(userId);
        return userRepository.updateById(user._id, dto);
    }

    public async updateByAdmin(
        { userId, initiatorId, initiatorRole }: UserInitiatorType,
        dto: UserUpdateByAdminDtoType,
    ): Promise<UserType> {
        const user = await this.getById(userId);
        userAccessService.checkSelfAction(user._id, initiatorId);

        if (dto.email) {
            await userAccessService.checkEmailUniqueness(dto.email);
        }

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        userAccessService.checkIsStaff(role, initiatorRole);

        return userRepository.updateById(user._id, dto);
    }

    public async deleteById({
        userId,
        initiatorId,
        initiatorRole,
    }: UserInitiatorType): Promise<void> {
        const user = await this.getById(userId);
        userAccessService.checkSelfAction(userId, initiatorId);

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );
        userAccessService.checkIsStaff(role, initiatorRole);
        await userRepository.updateById(user._id, {
            email: emailService.hideEmail(user.email),
        });
        await subscriptionRepository.deleteById(user.subscriptionId);
        await listingRepository.deleteAllByUserId(user._id);
        await userRepository.deleteById(user._id);
    }

    public async setStatusByStaff({
        userId,
        initiatorId,
        initiatorRole,
        isActive,
    }: UserInitiatorType & { isActive: boolean }) {
        const user = await this.getById(userId);
        ensureIsStatusSame(
            user.isActive,
            isActive,
            `User is already ${user.isActive ? "activated" : "deactivated"} `,
        );
        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );
        userAccessService.checkSelfAction(userId, initiatorId);
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

        return userRepository.updateById(userId, {
            isActive,
        });
    }

    public async setPlatformRole(
        { userId, initiatorId, initiatorRole }: UserInitiatorType,
        dto: { newRole: PlatformRoleEnum },
    ): Promise<UserType> {
        const user = await this.getById(userId);

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        userAccessService.checkSelfAction(user._id, initiatorId);
        userAccessService.checkIsStaff(role, initiatorRole);
        const { _id } = await platformRoleService.getPlatformRole(dto.newRole);
        return userRepository.updateById(user._id, { platformRoleId: _id });
    }

    public async closeAccount({
        userId,
        initiatorId,
        initiatorRole,
        subscriptionId,
        isActive,
        email,
    }: UserInitiatorType & {
        email: string;
        subscriptionId: string;
        isActive: boolean;
    }): Promise<UserType> {
        userAccessService.checkOwnership(userId, initiatorId, "account");

        if (userAccessService.isStaff(initiatorRole)) {
            userAccessService.checkSelfAction(userId, initiatorId);
        }
        ensureIsActive(isActive, "User is already deactivated");
        await userRepository.updateById(userId, {
            email: emailService.hideEmail(email),
        });
        await listingRepository.deleteAllByUserId(userId);
        await subscriptionRepository.deleteById(subscriptionId);
        return userRepository.deleteById(userId);
    }

    public async becomeSeller({
        userId,
        initiatorId,
        initiatorRole,
    }: UserInitiatorType): Promise<UserType> {
        if (initiatorRole === PlatformRoleEnum.SELLER) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User is already a seller",
            );
        }

        const { _id: sellerRoleId } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.SELLER,
        );

        if (userAccessService.isStaff(initiatorRole)) {
            userAccessService.checkSelfAction(userId, initiatorId);
        }

        return userRepository.updateById(userId, {
            platformRoleId: sellerRoleId,
        });
    }

    public async topUpBalance(
        userId: string,
        currentBalance: CurrencyAmountType,
        { amount, currency }: CurrencyAmountType,
    ): Promise<{ balance: CurrencyAmountType; credited: CurrencyAmountType }> {
        const convertedMoney = await pricingService.convertToUAH(
            amount,
            currency,
        );

        const newTotalAmount =
            Math.round((currentBalance.amount + convertedMoney) * 100) / 100;

        const updatedBalance = {
            amount: newTotalAmount,
            currency: CurrencyEnum.UAH,
        };

        await userRepository.updateById(userId, {
            balance: updatedBalance,
        });

        return {
            balance: updatedBalance,
            credited: { amount: Math.round(amount * 100) / 100, currency },
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
