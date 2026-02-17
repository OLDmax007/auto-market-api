import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { subscriptionService } from "../services/subscription.service";
import { userService } from "../services/user.service";
import { PlatformRoleType } from "../types/permissions/platform-role.type";
import { CurrencyAmountType } from "../types/rate.type";
import { TokenPayloadType } from "../types/token.type";
import {
    UserType,
    UserUpdateByAdminDtoType,
    UserUpdateDtoType,
} from "../types/user.type";

class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await userService.getAll();
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params as { userId: string };
            const data = await userService.getById(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user as UserType;
            res.status(HttpStatusEnum.OK).json(user);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async updateMe(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const dto = req.body as UserUpdateDtoType;
            const data = await userService.updateMe(userId, dto);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async updateByAdmin(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId: userIdByParams } = req.params as { userId: string };
            const { userId: userIdByPayload } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const dto = req.body as UserUpdateByAdminDtoType;
            const data = await userService.updateByAdmin(
                userIdByParams,
                userIdByPayload,
                role,
                dto,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async activateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId: userIdByParams } = req.params as { userId: string };
            const { userId: userIdByPayload } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await userService.activateUser(
                userIdByParams,
                userIdByPayload,
                role,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deactivateUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId: userIdByParams } = req.params as { userId: string };
            const { userId: userIdByPayload } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await userService.deactivateUser(
                userIdByParams,
                userIdByPayload,
                role,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId: userIdByParams } = req.params as { userId: string };
            const { userId: userIdByPayload } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await userService.deleteById(
                userIdByParams,
                userIdByPayload,
                role,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async becomeSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await userService.becomeSeller(userId, role);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async upgradeToPremium(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = req.res.locals.tokenPayload as TokenPayloadType;
            const data = await subscriptionService.upgradeToPremium(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async topUpBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { balance } = res.locals.user as UserType;
            const dto = req.body as CurrencyAmountType;
            const data = await userService.topUpBalance(userId, balance, dto);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const userController = new UserController();
