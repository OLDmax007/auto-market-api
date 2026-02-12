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
