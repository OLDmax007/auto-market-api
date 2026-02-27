import { NextFunction, Request, Response } from "express";

import { CarMarkEnum } from "../enums/car.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { carService } from "../services/car.service";
import { CarMissingReportType } from "../types/car.type";

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

    public async reportMissingCar(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const dto = req.body as CarMissingReportType;
            await carService.sendMissingCarData(dto);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const carController = new CarController();
