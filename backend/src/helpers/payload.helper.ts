import { TokenPayloadBuildType } from "../types/token.type";
import { UserType } from "../types/user.type";

export const buildTokenPayload = (
    userData: Partial<UserType>,
): TokenPayloadBuildType => {
    return {
        userId: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
    };
};
