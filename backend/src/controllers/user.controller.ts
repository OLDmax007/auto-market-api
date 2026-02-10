import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { userService } from "../services/user.service";
import { CurrencyAmountType } from "../types/rate.type";
import { TokenPayloadType } from "../types/token.type";
import {
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
            const { userId } = req.res.locals.payload as TokenPayloadType;
            const data = await userService.getById(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async updateMe(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.res.locals.payload as TokenPayloadType;
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
            const { userId } = req.params as { userId: string };
            const dto = req.body as UserUpdateByAdminDtoType;
            const data = await userService.updateByAdmin(userId, dto);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params as { userId: string };
            const data = await userService.deleteById(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async activateUser(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("dog");
            const { userId } = req.params as { userId: string };
            const data = await userService.activateUser(userId);
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
            const { userId } = req.params as { userId: string };
            const data = await userService.deactivateUser(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async becomeSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.payload as TokenPayloadType;
            const data = await userService.becomeSeller(userId);
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
            const { userId } = res.locals.payload as TokenPayloadType;
            const data = await userService.upgradeToPremium(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async topUpBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.payload as TokenPayloadType;
            const dto = req.body as CurrencyAmountType;
            const data = await userService.topUpBalance(userId, dto);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const userController = new UserController();
