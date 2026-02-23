import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { ensureIsActive, ensureIsStatusSame } from "../helpers/ensure.helper";
import { getPaginationOptions } from "../helpers/pagination.helper";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingCreateDtoType,
    ListingType,
    ListingUpdateDtoType,
} from "../types/listing.type";
import { PaginateFilterType, QueryType } from "../types/pagination.type";
import { TokenPayloadType } from "../types/token.type";
import { carService } from "./car.service";
import { listingAccessService } from "./listing-access.service";
import { listingStaticService } from "./listing-static.service";
import { locationService } from "./location.service";
import { pricingService } from "./pricing.service";
import { profanityService } from "./profanity.service";

class ListingService {
    public async getAll(
        query: QueryType & {
            minPrice?: string;
            maxPrice?: string;
            currency?: string;
        } = {},
        moderationQuery: { isProfanity?: string; isActive?: string } = {},
    ): Promise<ListingType[]> {
        const filter: PaginateFilterType = {};

        if (moderationQuery.isActive !== undefined) {
            filter.isActive = moderationQuery.isActive === "true";
        }

        if (moderationQuery.isProfanity !== undefined) {
            filter.isActive = moderationQuery.isProfanity === "true";
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
        profanityService.checkProfanity(newDto.title, newDto.description);
        await listingAccessService.checkUserLimit(userId);
        await locationService.validateCityInRegion(newDto.region, newDto.city);
        await carService.validateCarModel(newDto.make, newDto.model);

        const prices = await pricingService.calculateListingPrices(
            amount,
            currency,
        );

        if (!prices.length) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Pricing calculation failed",
            );
        }

        const listing = await listingRepository.create({
            userId,
            organizationId,
            prices,
            publishedAt: new Date(),
            isActive: true,
            profanityCheckAttempts: 0,
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
            profanityCheckAttempts: number;
        },
    ): Promise<ListingType> {
        const listing = await this.getById(id);
        listingAccessService.checkAccess(listing._id, userId, role);

        ensureIsStatusSame(
            listing.isActive,
            listingModeration.isActive,
            `Listing is already ${listing.isActive ? "activated" : "deactivated"} `,
        );

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
}

export const listingService = new ListingService();
