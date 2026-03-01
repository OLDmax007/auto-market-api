import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { CarMarkEnum } from "./car.enum";
import { carService } from "./car.service";

class CarController {
    public async getAllMakes(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await carService.getAllMakes();
            res.status(HttpStatusEnum.OK).json(data);
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
            const make = req.params.make as CarMarkEnum;
            const data = await carService.getModelsByMake(make);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async reportMissingModel(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const dto = req.body as { model: string };
            await carService.sendMissingModel(dto);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const carController = new CarController();
