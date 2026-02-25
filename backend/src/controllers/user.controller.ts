import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { subscriptionService } from "../services/subscription.service";
import { userService } from "../services/user.service";
import { QueryType } from "../types/pagination.type";
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
            const query = req.query as QueryType;
            const data = await userService.getAll(query);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getByIdForModeration(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = req.params as { userId: string };
            const data = await userService.getById(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getPublicById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = req.params as { userId: string };
            const data = await userService.getPublicById(userId);
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
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const dto = req.body as UserUpdateDtoType;
            const data = await userService.updateByRole(
                userId,
                userId,
                role,
                dto,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async updateByRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId: userIdByParams } = req.params as { userId: string };
            const { userId: userIdByPayload } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const dto = req.body as UserUpdateByAdminDtoType;
            const data = await userService.updateByRole(
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
            const data = await userService.setStatusByRole(
                userIdByParams,
                userIdByPayload,
                role,
                true,
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
            const data = await userService.setStatusByRole(
                userIdByParams,
                userIdByPayload,
                role,
                false,
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
            await userService.deleteById(userIdByParams, userIdByPayload, role);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async setPlatformRole(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId: userIdByParams } = req.params as { userId: string };
            const { userId: userIdByPayload } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const body = req.body as { newRole: PlatformRoleEnum };
            const data = await userService.setPlatformRole(
                userIdByParams,
                userIdByPayload,
                role,
                body,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async closeMe(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { isActive, _id, subscriptionId } = res.locals
                .user as UserType;
            const data = await userService.closeAccount(
                _id,
                userId,
                subscriptionId,
                isActive,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async becomeSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { _id } = res.locals.rolePayload as PlatformRoleType;
            const data = await userService.becomeSeller(userId, _id);
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
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
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
