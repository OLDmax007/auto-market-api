import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { listingService } from "../services/listing.service";
import { ListingCreateDtoType } from "../types/listing.type";
import { TokenPayloadType } from "../types/token.type";

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

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.res.locals.payload as TokenPayloadType;
            const dto = req.body as ListingCreateDtoType;
            const data = await listingService.create(userId, dto);
            res.status(HttpStatusEnum.CREATED).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const listingController = new ListingController();
