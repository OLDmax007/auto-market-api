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

export const ensureIsActive = (isActive: boolean, message: string): void => {
    if (!isActive) {
        throw new ApiError(HttpStatusEnum.FORBIDDEN, message);
    }
};

export const ensureIsNotActive = (isActive: boolean, message: string): void => {
    if (isActive) {
        throw new ApiError(HttpStatusEnum.BAD_REQUEST, message);
    }
};
