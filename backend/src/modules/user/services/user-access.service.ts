import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { userRepository } from "../repositories/user.repository";

class UserAccessService {
    public isSelfAction(targetUserId: string, initiatorId: string): boolean {
        return String(targetUserId) === String(initiatorId);
    }

    public isStaff(initiatorRole: PlatformRoleEnum): boolean {
        return [PlatformRoleEnum.ADMIN, PlatformRoleEnum.MANAGER].includes(
            initiatorRole,
        );
    }

    public checkIsStaff(
        targetRole: PlatformRoleEnum,
        initiatorRole: PlatformRoleEnum,
    ): void {
        if (targetRole === PlatformRoleEnum.ADMIN) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "This entity belongs to an Administrator and cannot be modified",
            );
        }
        if (
            targetRole === PlatformRoleEnum.MANAGER &&
            initiatorRole === PlatformRoleEnum.MANAGER
        ) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Managers cannot modify each other's data",
            );
        }
    }

    public checkSelfAction(targetUserId: string, initiatorId: string): void {
        if (this.isSelfAction(targetUserId, initiatorId)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "You cannot perform administrative actions on yourself",
            );
        }
    }

    public checkOwnership(
        targetUserId: string,
        initiatorId: string,
        entityName: string,
    ): void {
        if (!this.isSelfAction(targetUserId, initiatorId)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `You are not the owner of this ${entityName}`,
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

    public async checkEmailUniqueness(
        email: string,
        message = "User with this email already exists",
    ): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError(HttpStatusEnum.CONFLICT, message);
        }
    }
}
export const userAccessService = new UserAccessService();
