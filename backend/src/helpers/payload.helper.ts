import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { TokenPayloadBuildType } from "../types/token.type";
import { UserType } from "../types/user.type";

export const buildTokenPayload = (
    user: UserType,
    role: PlatformRoleEnum,
    permissionIds: string[],
): TokenPayloadBuildType => {
    return {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        platformRoleId: user.platformRoleId,
        role,
        permissionIds,
    };
};
