import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { ApiError } from "../errors/api.error";
import { platformRoleService } from "../services/platform-role.service";
import { UserType } from "../types/user.type";

class RoleMiddleware {
    public checkPermission(permission: PlatformPermissionEnum) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = res.locals.user as UserType;

                if (!user) {
                    throw new ApiError(
                        HttpStatusEnum.UNAUTHORIZED,
                        "User context not found",
                    );
                }

                const role = await platformRoleService.getPlatformRoleById(
                    user.platformRoleId,
                );

                if (!role.permissions?.includes(permission)) {
                    throw new ApiError(
                        HttpStatusEnum.FORBIDDEN,
                        "You have no permission for this action",
                    );
                }

                res.locals.rolePayload = role;
                next();
            } catch (e: unknown) {
                next(e);
            }
        };
    }
}

export const roleMiddleware = new RoleMiddleware();
