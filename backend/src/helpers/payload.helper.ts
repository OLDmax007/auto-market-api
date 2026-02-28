import { TokenPayloadBuildType } from "../types/token.type";

export const buildTokenPayload = (
    userData: Partial<{
        _id: string;
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
    }>,
): TokenPayloadBuildType => {
    return {
        userId: userData._id || userData.userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
    };
};
