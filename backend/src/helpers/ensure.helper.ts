import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";

export const ensureEntityExists = <T>(
    entity: T | null | undefined,
    message: string,
): T => {
    if (!entity) {
        throw new ApiError(HttpStatusEnum.NOT_FOUND, message);
    }
    return entity;
};

export const ensureOwnership = (
    entityId: string | unknown,
    initiatorId: string | unknown,
    message = "Access denied: You do not have permission to perform this action",
): void => {
    if (String(entityId) !== String(initiatorId)) {
        throw new ApiError(HttpStatusEnum.FORBIDDEN, message);
    }
};

export const ensureNotSelfAction = (
    targetId: string | unknown,
    initiatorId: string | unknown,
    message = "You cannot perform this action on your own account",
): void => {
    if (String(targetId) === String(initiatorId)) {
        throw new ApiError(HttpStatusEnum.BAD_REQUEST, message);
    }
};

export const ensureIsNotActive = (
    isActive: boolean,
    message = "User account is suspended",
): void => {
    if (!isActive) {
        throw new ApiError(HttpStatusEnum.FORBIDDEN, message);
    }
};

export const ensureIsActive = (
    isActive: boolean,
    message = "User account is already activated",
): void => {
    if (isActive) {
        throw new ApiError(HttpStatusEnum.FORBIDDEN, message);
    }
};
