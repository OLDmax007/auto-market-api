import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { listingService } from "../services/listing.service";
import { listingStaticService } from "../services/listing-static.service";
import { ListingCreateDtoType } from "../types/listing.type";
import { PlatformRoleType } from "../types/permissions/platform-role.type";
import { TokenPayloadType } from "../types/token.type";
import { UserType } from "../types/user.type";

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
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.getFullInfoWithIncrement(
                listingId,
                userId,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { _id: userId, organizationId } = res.locals.user as UserType;
            const dto = req.body as ListingCreateDtoType;
            const data = await listingService.create(
                userId,
                organizationId,
                dto,
            );
            res.status(HttpStatusEnum.CREATED).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await listingService.updateByRole(
                listingId,
                userId,
                role,
                req.body,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await listingService.deleteById(
                listingId,
                userId,
                role,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deactivateListing(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await listingService.deactivateListing(
                listingId,
                userId,
                role,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async activateListing(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await listingService.activateListing(
                listingId,
                userId,
                role,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getPremiumListingStats(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { _id, subscriptionId } = res.locals.user as UserType;
            const data = await listingStaticService.getPremiumStatsByListingId(
                _id,
                subscriptionId,
                listingId,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (err) {
            next(err);
        }
    }
}

export const listingController = new ListingController();
