import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { userService } from "../services/user.service";
import { CurrencyAmountType } from "../types/rate.type";
import { TokenPayloadType } from "../types/token.type";

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

    public async becomeSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.res.locals.payload as TokenPayloadType;
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
            const { userId } = req.res.locals.payload as TokenPayloadType;
            const data = await userService.upgradeToPremium(userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async topUpBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.res.locals.payload as TokenPayloadType;
            const dto = req.body as CurrencyAmountType;
            const data = await userService.topUpBalance(userId, dto);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const userController = new UserController();
