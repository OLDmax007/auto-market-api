import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { UserType } from "../user/types/user.type";
import { CarMakeEnum } from "./car.enum";
import { CarPresenter } from "./car.presenter";
import { carService } from "./car.service";

class CarController {
    private getUserData(res: Response) {
        const user = res.locals.user as UserType;
        return {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    public async getAllMakes(req: Request, res: Response, next: NextFunction) {
        try {
            const { makes } = await carService.getAllMakes();
            const presented = CarPresenter.toMakeListResponse(makes);
            res.status(HttpStatusEnum.OK).json({ makes: presented });
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getModelsByMake(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const make = req.params.make as CarMakeEnum;
            const { models } = await carService.getModelsByMake(make);
            const presented = CarPresenter.toModelListResponse(models);
            res.status(HttpStatusEnum.OK).json({ models: presented });
        } catch (e: unknown) {
            next(e);
        }
    }

    public reportMissingModel = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const dto = req.body as { make: CarMakeEnum; model: string };
            const userData = this.getUserData(res);
            await carService.sendMissingModel(userData, dto);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    };

    public reportMissingMake = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const dto = req.body as { make: string };
            const userData = this.getUserData(res);
            await carService.sendMissingMake(userData, dto);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    };
}

export const carController = new CarController();
