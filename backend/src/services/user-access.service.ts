import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { UserType } from "../types/user.type";
import { platformRoleService } from "./platform-role.service";
import { userService } from "./user.service";

class UserAccessService {
    public isOwner(userid: string, initiatorId: string): void {
        if (String(userid) !== String(initiatorId)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "You can only manage your own account",
            );
        }
    }

    private checkNotSelfAction(
        userId: string,
        initiatorId: string,
        action: string,
    ): void {
        if (userId === initiatorId) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `You cannot ${action} your own account via this method`,
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

    public ensureIsNotActive(isActive: boolean): void {
        if (!isActive) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "User account is suspended",
            );
        }
    }

    public ensureIsActive(isActive: boolean): void {
        if (isActive) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "User account is already activated",
            );
        }
    }

    public checkIsVerified(isVerified: boolean): void {
        if (isVerified) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User is already verified",
            );
        }
    }

    public async getTargetUserWithHierarchyCheck(
        userId: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        action: string,
    ): Promise<UserType> {
        this.checkNotSelfAction(userId, initiatorId, action);

        const user = await userService.getById(userId);

        const { role } = await platformRoleService.getPlatformRoleById(
            user.platformRoleId,
        );

        if (role === PlatformRoleEnum.ADMIN) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `Cannot ${action} an Administrator`,
            );
        }

        if (
            initiatorRole === PlatformRoleEnum.MANAGER &&
            role === PlatformRoleEnum.MANAGER
        ) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `Managers cannot ${action} other Managers`,
            );
        }

        return user;
    }
}

export const userAccessService = new UserAccessService();
