import { mainConfig } from "../../common/configs/main.config";
import { PlatformRoleEnum } from "./enums/platform-role.enum";
import { UserType } from "./types/user.type";

export class UserPresenter {
    private static getBaseFields(user: UserType) {
        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            avatar: `${mainConfig.AWS_S3_BUCKET_URL}/${user.avatar}`,
            organizationId: user.organizationId,
        };
    }

    public static toPublicResponse(user: UserType): Partial<UserType> {
        return this.getBaseFields(user);
    }

    public static toPrivateResponse(user: UserType): Partial<UserType> {
        return {
            ...this.getBaseFields(user),
            platformRoleId: user.platformRoleId,
            subscriptionId: user.subscriptionId,
            email: user.email,
            balance: user.balance,
            isActive: user.isActive,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        };
    }

    public static toStaffResponse(user: UserType): Partial<UserType> {
        return {
            ...this.getBaseFields(user),
            email: user.email,
            platformRoleId: user.platformRoleId,
            subscriptionId: user.subscriptionId,
            isActive: user.isActive,
            isVerified: user.isVerified,
            isDeleted: user.isDeleted,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    public static toAdminResponse(user: UserType): Partial<UserType> {
        return {
            ...this.toStaffResponse(user),
            balance: user.balance,
        };
    }

    public static toResponseByRole(
        user: UserType,
        role: PlatformRoleEnum,
    ): Partial<UserType> {
        if (role === PlatformRoleEnum.ADMIN) {
            return this.toAdminResponse(user);
        }

        if (role === PlatformRoleEnum.MANAGER) {
            return this.toStaffResponse(user);
        }

        return this.toPublicResponse(user);
    }
}
