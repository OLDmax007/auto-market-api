import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { QueryType } from "../../common/types/pagination.type";
import { TokenPayloadType } from "../auth/token.type";
import { CurrencyAmountType } from "../rate/rate.type";
import { PlatformRoleEnum } from "./enums/platform-role.enum";
import { userService } from "./services/user.service";
import { PlatformRoleType } from "./types/platform-role.type";
import {
    UserType,
    UserUpdateByAdminDtoType,
    UserUpdateDtoType,
} from "./types/user.type";
import { UserPresenter } from "./user.presenter";

class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as QueryType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await userService.getAll(query);
            const presented = data.docs.map((user) =>
                UserPresenter.toResponseByRole(user, role),
            );
            res.status(HttpStatusEnum.OK).json({ ...data, docs: presented });
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getByIdForStaff(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = req.params as { userId: string };
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await userService.getById(userId);
            const presented = UserPresenter.toResponseByRole(data, role);
            res.status(HttpStatusEnum.OK).json(presented);
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
            const presented = UserPresenter.toPublicResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user as UserType;
            const presented = UserPresenter.toPrivateResponse(user);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async updateMe(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const dto = req.body as UserUpdateDtoType;
            const data = await userService.updateMe(userId, dto);
            const presented = UserPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
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
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const dto = req.body as UserUpdateByAdminDtoType;
            const data = await userService.updateByAdmin(
                { userId, initiatorId, initiatorRole },
                dto,
            );
            const presented = UserPresenter.toResponseByRole(
                data,
                initiatorRole,
            );
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const data = await userService.setStatusByStaff({
                userId,
                initiatorId,
                initiatorRole,
                isActive: true,
            });
            const presented = UserPresenter.toResponseByRole(
                data,
                initiatorRole,
            );
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deactivate(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const data = await userService.setStatusByStaff({
                userId,
                initiatorId,
                initiatorRole,
                isActive: false,
            });
            const presented = UserPresenter.toResponseByRole(
                data,
                initiatorRole,
            );
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async closeMe(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const {
                isActive,
                _id: initiatorId,
                subscriptionId,
                email,
            } = res.locals.user as UserType;
            const data = await userService.closeAccount({
                userId,
                initiatorRole,
                initiatorId,
                isActive,
                subscriptionId,
                email,
            });
            const presented = UserPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
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
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const body = req.body as { newRole: PlatformRoleEnum };
            const data = await userService.setPlatformRole(
                { userId, initiatorId, initiatorRole },
                body,
            );
            const presented = UserPresenter.toResponseByRole(
                data,
                initiatorRole,
            );
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async becomeSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { _id: initiatorId } = res.locals.user as UserType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const data = await userService.becomeSeller({
                userId,
                initiatorId,
                initiatorRole,
            });
            const presented = UserPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
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

    public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const avatar = req.files.avatar as UploadedFile;
            const data = await userService.uploadAvatar(userId, avatar);
            const presented = UserPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.CREATED).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deleteAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await userService.deleteAvatar(userId);
            const presented = UserPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.CREATED).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            await userService.deleteById({
                userId,
                initiatorId,
                initiatorRole,
            });
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const userController = new UserController();
