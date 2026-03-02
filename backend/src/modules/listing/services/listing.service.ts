import { UploadedFile } from "express-fileupload";

import { DEFAULT_IMAGES_ENDPOINTS } from "../../../common/constants/default-images-endpoints.constants";
import { CurrencyEnum } from "../../../common/enums/currency.enum";
import { FileItemEnum } from "../../../common/enums/file-item.enum";
import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import {
    ensureIsActive,
    ensureIsStatusSame,
} from "../../../common/helpers/ensure.helper";
import { getPaginationOptions } from "../../../common/helpers/pagination.helper";
import { s3Service } from "../../../common/services/s3.service";
import {
    ListingQueryType,
    PaginateFilterType,
} from "../../../common/types/pagination.type";
import { TokenPayloadType } from "../../auth/token.type";
import { carService } from "../../car/car.service";
import { locationService } from "../../location/location.service";
import { PlatformRoleEnum } from "../../user/enums/platform-role.enum";
import { userAccessService } from "../../user/services/user-access.service";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingCreateDtoType,
    ListingType,
    ListingUpdateDtoType,
} from "../types/listing.type";
import { listingAccessService } from "./listing-access.service";
import { listingStaticService } from "./listing-static.service";
import { pricingService } from "./pricing.service";
import { profanityService } from "./profanity.service";

class ListingService {
    public async getAll(query: ListingQueryType = {}): Promise<ListingType[]> {
        const filter: PaginateFilterType = {};
        if (query.userId) {
            filter.userId = String(query.userId);
        }
        if (query.isActive !== undefined) {
            filter.isActive = String(query.isActive) === "true";
        }

        if (query.isProfanity !== undefined) {
            filter.isProfanity = String(query.isProfanity) === "true";
        }
        if (query.minPrice || query.maxPrice) {
            filter.prices = {
                $elemMatch: {
                    currency: query.currency || CurrencyEnum.UAH,
                    amount: {
                        ...(query.minPrice && {
                            $gte: Number(query.minPrice),
                        }),
                        ...(query.maxPrice && {
                            $lte: Number(query.maxPrice),
                        }),
                    },
                },
            };
        }

        if (query.search) {
            filter.$or = [
                { title: { $regex: query.search, $options: "i" } },
                { make: { $regex: query.search, $options: "i" } },
                { model: { $regex: query.search, $options: "i" } },
                { country: { $regex: query.search, $options: "i" } },
                { city: { $regex: query.search, $options: "i" } },
                { region: { $regex: query.search, $options: "i" } },
            ];
        }

        const options = getPaginationOptions(query);

        const listings = await listingRepository.getAllPaginated(
            filter,
            options,
        );
        return listings.docs;
    }

    public async getMyById(id: string, userId: string): Promise<ListingType> {
        const listing = await this.getById(id);

        userAccessService.checkAccountOwnership(
            listing.userId,
            userId,
            "listing",
        );

        return listing;
    }

    public async getById(id: string): Promise<ListingType> {
        const listing = await listingRepository.getById(id);

        if (!listing) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Listing not found");
        }
        return listing;
    }

    public async getFullInfoWithIncrement(
        id: string,
        payload?: TokenPayloadType,
    ): Promise<ListingType> {
        const listing = await this.getById(id);

        if (!listing.isActive || listing.isProfanity) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Listing not found");
        }

        if (payload) {
            if (String(listing.userId) !== String(payload.userId)) {
                await listingStaticService.incrementViewsByListingId(
                    listing._id,
                );
            }
        }

        return listing;
    }

    public async create(
        userId: string,
        organizationId: string,
        { enteredPrice: { amount, currency }, ...newDto }: ListingCreateDtoType,
    ): Promise<ListingType> {
        await listingAccessService.checkUserLimit(userId);
        await locationService.validateCityInRegion(newDto.region, newDto.city);
        await carService.validateCarModel(newDto.make, newDto.model);

        const prices = await pricingService.getCalculatedPrices({
            amount,
            currency,
        });

        if (!prices.length) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Pricing calculation failed",
            );
        }
        const isDirty = profanityService.hasAnyProfanity(
            newDto.title,
            newDto.description,
        );

        const listing = await listingRepository.create({
            userId,
            organizationId,
            prices,
            publishedAt: !isDirty ? new Date() : null,
            isActive: !isDirty,
            isProfanity: isDirty,
            ...newDto,
        });
        await listingStaticService.createViews({
            listingId: listing._id,
            views: {
                all: 0,
                day: 0,
                month: 0,
                week: 0,
            },
        });

        if (isDirty) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Listing created but deactivated due to profanity. Please go to your cabinet to edit it",
            );
        }

        return listing;
    }

    public async updateByRole(
        id: string,
        userId: string,
        role: PlatformRoleEnum,
        dto: ListingUpdateDtoType,
    ) {
        const listing = await this.getById(id);
        listingAccessService.checkAccess(listing.userId, userId, role);

        const { updateProfanity, error } =
            await listingAccessService.handleProfanity(listing, role, dto);

        if (dto.region || dto.city) {
            await locationService.validateCityInRegion(
                dto.region ?? listing.region,
                dto.city ?? listing.city,
            );
        }
        if (dto.make || dto.model) {
            await carService.validateCarModel(
                dto.make ?? listing.make,
                dto.model ?? listing.model,
            );
        }

        let updateDto: Partial<ListingCreateDbType> = { ...dto };

        if (dto.enteredPrice) {
            updateDto.prices = await pricingService.getCalculatedPrices(
                dto.enteredPrice,
            );
        }

        const updatedListing = await listingRepository.updateById(id, {
            ...updateDto,
            ...updateProfanity,
        });

        if (error) {
            throw error;
        }

        return updatedListing;
    }

    public async setStatusByRole(
        id: string,
        userId: string,
        role: PlatformRoleEnum,
        listingModeration: {
            isActive: boolean;
        },
    ): Promise<ListingType> {
        const listing = await this.getById(id);
        listingAccessService.checkAccess(listing.userId, userId, role);

        ensureIsStatusSame(
            listing.isActive,
            listingModeration.isActive,
            `Listing is already ${listing.isActive ? "activated" : "deactivated"} `,
        );

        if (listingModeration.isActive && listing.isProfanity) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Profanity detected. Please clean up title or description",
            );
        }

        return listingRepository.updateById(id, listingModeration);
    }

    public async deleteById(
        id: string,
        userId: string,
        role: PlatformRoleEnum,
    ): Promise<void> {
        const listing = await this.getById(id);
        listingAccessService.checkAccess(listing.userId, userId, role);
        await listingRepository.deleteById(id);
    }

    public async closeListing(
        id: string,
        initiatorId: string,
    ): Promise<ListingType> {
        const listing = await this.getById(id);
        listingAccessService.checkListingOwnership(listing.userId, initiatorId);
        ensureIsActive(listing.isActive, "Listing is already deactivated");
        return listingRepository.updateById(id, {
            isActive: false,
        });
    }

    public async uploadPoster(
        listingId: string,
        userId: string,
        file: UploadedFile,
    ): Promise<ListingType> {
        const listing = await this.getById(listingId);
        userAccessService.checkAccountOwnership(
            listing.userId,
            userId,
            "listing",
        );
        ensureIsActive(listing.isActive, "Listing is deactivated");

        if (
            listing.poster &&
            listing.poster !== DEFAULT_IMAGES_ENDPOINTS.listing
        ) {
            await s3Service.deleteFile(listing.poster);
        }

        const poster = await s3Service.uploadFile(
            file,
            FileItemEnum.LISTINGS,
            listingId,
        );

        return listingRepository.updateById(listingId, { poster });
    }

    public async deletePoster(
        listingId: string,
        userId: string,
    ): Promise<ListingType> {
        const listing = await this.getById(listingId);
        userAccessService.checkAccountOwnership(
            listing.userId,
            userId,
            "listing",
        );
        ensureIsActive(listing.isActive, "Listing is deactivated");

        if (
            !listing.poster ||
            listing.poster === DEFAULT_IMAGES_ENDPOINTS.listing
        ) {
            return listing;
        }

        await s3Service.deleteFile(listing.poster);

        return listingRepository.updateById(listingId, {
            poster: DEFAULT_IMAGES_ENDPOINTS.listing,
        });
    }
}

export const listingService = new ListingService();
