import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { UserType } from "../types/user.type";
import { platformRoleService } from "./platform-role.service";
import { userService } from "./user.service";

class UserAccessService {
    public checkAccountOwnership(
        targetUserId: string,
        initiatorId: string,
    ): void {
        if (String(targetUserId) !== String(initiatorId)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "You are not the owner of this account",
            );
        }
    }

    public checkIsVerified(isVerified: boolean): void {
        if (!isVerified) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Please verify your email first",
            );
        }
    }

    public checkIsNotVerified(isVerified: boolean): void {
        if (isVerified) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Email is already verified",
            );
        }
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

    public async getTargetUserWithHierarchyCheck(
        userId: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
    ): Promise<UserType> {
        if (String(userId) === String(initiatorId)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "You cannot perform this action on yourself",
            );
        }

        const user = await userService.getById(userId);

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        if (role === PlatformRoleEnum.ADMIN) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `Cannot perform action on an Administrator`,
            );
        }

        if (
            initiatorRole === PlatformRoleEnum.MANAGER &&
            role === PlatformRoleEnum.MANAGER
        ) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `Managers cannot perform actions on other Managers`,
            );
        }

        return user;
    }
}

export const userAccessService = new UserAccessService();
