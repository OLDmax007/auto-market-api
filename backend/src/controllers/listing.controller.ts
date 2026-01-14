import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { listingService } from "../services/listing.service";

class ListingController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await listingService.getAll();
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const data = await listingService.getById(listingId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const listingController = new ListingController();
