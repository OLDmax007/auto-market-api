import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { listingService } from "../services/listing.service";
import { listingStaticService } from "../services/listing-static.service";
import {
    ListingCreateDtoType,
    ListingUpdateDtoType,
} from "../types/listing.type";
import { ListingQueryType } from "../types/pagination.type";
import { PlatformRoleType } from "../types/permissions/platform-role.type";
import { TokenPayloadType } from "../types/token.type";
import { UserType } from "../types/user.type";

class ListingController {
    public async getAllPublic(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as ListingQueryType;

            const data = await listingService.getAll({
                ...query,
                isActive: true,
                isProfanity: false,
            });
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
            const { listingId } = req.params as { listingId: string };
            const payload = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.getFullInfoWithIncrement(
                listingId,
                payload,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getAllMy(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as ListingQueryType;
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.getAll({ ...query, userId });
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getMyById(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.getMyById(listingId, userId);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getAllByModeration(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const query = req.query as ListingQueryType;
            const data = await listingService.getAll(query);
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
            const { listingId } = req.params as { listingId: string };
            const data = await listingService.getById(listingId);
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
            const dto = req.body as ListingUpdateDtoType;
            const data = await listingService.updateByRole(
                listingId,
                userId,
                role,
                dto,
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
            await listingService.deleteById(listingId, userId, role);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
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
            const data = await listingService.setStatusByRole(
                listingId,
                userId,
                role,
                { isActive: false },
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
            const data = await listingService.setStatusByRole(
                listingId,
                userId,
                role,
                { isActive: true },
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async closeMyListing(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.closeListing(listingId, userId);
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
