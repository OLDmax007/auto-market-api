import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { ListingQueryType } from "../../common/types/pagination.type";
import { TokenPayloadType } from "../auth/token.type";
import { PlatformRoleType } from "../user/types/platform-role.type";
import { UserType } from "../user/types/user.type";
import { ListingPresenter } from "./listing.presenter";
import { listingService } from "./services/listing.service";
import { listingStaticService } from "./services/listing-static.service";
import {
    ListingAdminUpdateDtoType,
    ListingCreateDtoType,
    ListingType,
    ListingUpdateDtoType,
} from "./types/listing.type";

class ListingController {
    public async getAllPublic(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as ListingQueryType;

            const data = await listingService.getAll({
                ...query,
                isActive: true,
                isProfanity: false,
            });
            const presented = data.docs.map((listing) =>
                ListingPresenter.toPublicResponse(listing),
            );
            res.status(HttpStatusEnum.OK).json({ ...data, docs: presented });
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
            const presented = ListingPresenter.toPublicResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getAllMy(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as ListingQueryType;
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.getAll({ ...query, userId });
            const presented = data.docs.map((listing) =>
                ListingPresenter.toPrivateResponse(listing),
            );
            res.status(HttpStatusEnum.OK).json({ ...data, docs: presented });
        } catch (e) {
            next(e);
        }
    }

    public async getMyById(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.getMyById(listingId, userId);
            const presented = ListingPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async getAllByStaff(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const query = req.query as ListingQueryType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await listingService.getAll(query);
            const presented = data.docs.map((listing) =>
                ListingPresenter.toResponseByRole(listing, role),
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
            const { listingId } = req.params as { listingId: string };
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const data = await listingService.getById(listingId);
            const presented = ListingPresenter.toResponseByRole(data, role);
            res.status(HttpStatusEnum.OK).json(presented);
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
            const presented = ListingPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.CREATED).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async updateMyListing(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const dto = req.body as ListingUpdateDtoType;
            const data = await listingService.updateMyListing(
                listingId,
                userId,
                dto,
            );
            const presented = ListingPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e) {
            next(e);
        }
    }

    public async updateByAdmin(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const dto = req.body as ListingAdminUpdateDtoType;
            const data = await listingService.updateByStaff(listingId, dto);
            const presented = ListingPresenter.toResponseByRole(data, role);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e) {
            next(e);
        }
    }

    public async updateByManager(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { role } = res.locals.rolePayload as PlatformRoleType;

            const dto: Pick<ListingType, "title" | "description"> = {
                title: req.body.title,
                description: req.body.description,
            };
            const data = await listingService.updateByStaff(listingId, dto);
            const presented = ListingPresenter.toResponseByRole(data, role);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e) {
            next(e);
        }
    }

    public async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const data = await listingService.setStatusByStaff({
                initiatorId,
                initiatorRole,
                listingId,
                isActive: true,
            });
            const presented = ListingPresenter.toResponseByRole(
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
            const { listingId } = req.params as { listingId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const data = await listingService.setStatusByStaff({
                initiatorId,
                initiatorRole,
                listingId,
                isActive: false,
            });
            const presented = ListingPresenter.toResponseByRole(
                data,
                initiatorRole,
            );
            res.status(HttpStatusEnum.OK).json(presented);
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
            const presented = ListingPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
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
            const { _id: userId, subscriptionId } = res.locals.user as UserType;
            const { role: initiatorRole } = res.locals
                .rolePayload as PlatformRoleType;
            const data = await listingStaticService.getPremiumStatsByListingId({
                userId,
                subscriptionId,
                initiatorRole,
                listingId,
            });
            res.status(HttpStatusEnum.OK).json(data);
        } catch (err) {
            next(err);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            await listingService.deleteById(listingId);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async uploadPoster(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const poster = req.files.poster as UploadedFile;
            const data = await listingService.uploadPoster(
                listingId,
                userId,
                poster,
            );
            const presented = ListingPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.CREATED).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deletePoster(req: Request, res: Response, next: NextFunction) {
        try {
            const { listingId } = req.params as { listingId: string };
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await listingService.deletePoster(listingId, userId);
            const presented = ListingPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.CREATED).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const listingController = new ListingController();
