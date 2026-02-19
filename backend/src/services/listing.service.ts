import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { getPaginationOptions } from "../helpers/pagination.helper";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingCreateDtoType,
    ListingModerationResultType,
    ListingType,
    ListingUpdateAdminDtoType,
    ListingUpdateManagerDtoType,
    ListingUpdateUserDtoType,
} from "../types/listing.type";
import { PaginateFilterType, QueryType } from "../types/pagination.type";
import { carService } from "./car.service";
import { listingStaticService } from "./listing-static.service";
import { locationService } from "./location.service";
import { moderationService } from "./moderation/moderation.service";
import { pricingService } from "./pricing.service";
import { profanityService } from "./profanity.service";
import { subscriptionService } from "./subscription.service";
import { userService } from "./user.service";

class ListingService {
    public async getAll(
        query: QueryType & {
            minPrice?: string;
            maxPrice?: string;
            currency?: string;
        } = {},
    ): Promise<ListingType[]> {
        const filter: PaginateFilterType = {};

        if (query.minPrice || query.maxPrice) {
            filter.prices = {
                $elemMatch: {
                    currency: query.currency || CurrencyEnum.UAH,
                    amount: {
                        ...(query.minPrice && { $gte: Number(query.minPrice) }),
                        ...(query.maxPrice && { $lte: Number(query.maxPrice) }),
                    },
                },
            };
        }
        console.log(filter);

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

        const listings = await listingRepository.getAllPaginated(filter, {
            ...options,
            select: "-_id -userId -organizationId -profanityCheckAttempts -isActive -createdAt -updatedAt",
        });
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
        userId?: string,
    ): Promise<ListingType> {
        const listing = await this.getById(id);

        const isOwner = userId
            ? String(listing.userId) === String(userId)
            : false;

        if (!isOwner) {
            await listingStaticService.incrementViewsByListingId(listing._id);
        }

        return listing;
    }

    public async create(
        userId: string,
        organizationId: string,
        { enteredPrice: { amount, currency }, ...newDto }: ListingCreateDtoType,
    ): Promise<ListingType> {
        const isProfanity = profanityService.hasAnyProfanity(
            newDto.title,
            newDto.description,
        );

        if (isProfanity) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Profanity detected. Please clean up your title or description.",
            );
        }

        await this.checkUserLimit(userId);
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

    public async updateByRole<
        T extends
            | ListingUpdateUserDtoType
            | ListingUpdateManagerDtoType
            | ListingUpdateAdminDtoType,
    >(id: string, userId: string, role: PlatformRoleEnum, dto: T) {
        const listing = await this.getById(id);
        this.checkAccess(listing.userId, userId, role);

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

        const { updateProfanity, error } = await this.handleProfanity(
            listing,
            role,
            dto,
        );

        const updatedListing = await listingRepository.updateById(id, {
            ...updateDto,
            ...updateProfanity,
        });

        if (error) {
            throw error;
        }

        return updatedListing;
    }

    public async activateListing(
        id: string,
        userId: string,
        role: PlatformRoleEnum,
    ): Promise<ListingType> {
        const listing = await this.getById(id);
        this.checkAccess(listing.userId, userId, role);

        if (!listing.isActive) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Listing  is already activated.",
            );
        }
        return listingRepository.updateById(id, {
            isActive: true,
            profanityCheckAttempts: 0,
        });
    }

    public async deactivateListing(
        id: string,
        userId: string,
        role: PlatformRoleEnum,
    ): Promise<ListingType> {
        const listing = await this.getById(id);

        this.checkAccess(listing.userId, userId, role);

        if (!listing.isActive) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Listing  is already deactivated.",
            );
        }
        return listingRepository.updateById(id, {
            isActive: false,
            profanityCheckAttempts: 0,
        });
    }

    public async deleteById(
        id: string,
        userId: string,
        role: PlatformRoleEnum,
    ): Promise<ListingType> {
        const listing = await this.getById(id);
        this.checkAccess(listing.userId, userId, role);
        return listingRepository.deleteById(id);
    }

    private async checkListingForProfanity(
        title: string,
        description: string,
        currentAttempts: number,
    ): Promise<ListingModerationResultType> {
        const maxAttempts = 3;
        const isProfanity = profanityService.hasAnyProfanity(
            title,
            description,
        );

        let profanityCheckAttempts = currentAttempts;
        let isActive = true;

        if (isProfanity) {
            if (currentAttempts >= 0) {
                profanityCheckAttempts += 1;
            }
            isActive = false;
            if (profanityCheckAttempts >= maxAttempts) {
                isActive = false;
            }
        } else {
            profanityCheckAttempts = 0;
        }

        return {
            isProfanity,
            isActive,
            profanityCheckAttempts,
            maxAttempts,
        };
    }

    private async checkUserLimit(userId: string): Promise<void> {
        const user = await userService.getById(userId);
        const currentListingsCount =
            await listingRepository.countByUserId(userId);

        const { planType, isActive } = await subscriptionService.getById(
            user.subscriptionId,
        );
        const limit =
            planType === PlanTypeEnum.PREMIUM && isActive ? Infinity : 1;

        if (currentListingsCount >= limit) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Limit reached. Upgrade your account!",
            );
        }
    }

    private async handleProfanity(
        listing: ListingType,
        role: PlatformRoleEnum,
        {
            title,
            description,
            isActive,
        }: { title?: string; description?: string; isActive?: boolean },
    ): Promise<{
        updateProfanity: Partial<ListingCreateDbType>;
        error: ApiError | null;
    }> {
        const updateProfanity: Partial<ListingCreateDbType> = {};
        if (title || description) {
            const mod = await this.checkListingForProfanity(
                title ?? listing.title,
                description ?? listing.description,
                listing.profanityCheckAttempts,
            );

            updateProfanity.isActive = mod.isActive;
            updateProfanity.profanityCheckAttempts = mod.profanityCheckAttempts;

            console.log(mod);
            if (role === PlatformRoleEnum.SELLER && mod.isProfanity) {
                if (mod.profanityCheckAttempts >= mod.maxAttempts) {
                    await moderationService.sendListWithInactiveListingToModeration(
                        {
                            title: listing.title,
                            _id: listing._id,
                            userId: listing.userId,
                        },
                        mod,
                    );
                    return {
                        updateProfanity,
                        error: new ApiError(
                            HttpStatusEnum.FORBIDDEN,
                            "Profanity attempts exceeded. Sent to moderation.",
                        ),
                    };
                } else {
                    console.log(updateProfanity);
                    return {
                        updateProfanity,
                        error: new ApiError(
                            HttpStatusEnum.BAD_REQUEST,
                            `Profanity detected. Attempts left: ${mod.maxAttempts - mod.profanityCheckAttempts} of ${mod.maxAttempts}`,
                        ),
                    };
                }
            }
        }

        if (
            (role === PlatformRoleEnum.MANAGER ||
                role === PlatformRoleEnum.ADMIN) &&
            isActive
        ) {
            updateProfanity.profanityCheckAttempts = 0;
        }

        return { updateProfanity, error: null };
    }

    private checkAccess(
        userIdByListing: string,
        userId: string,
        role: PlatformRoleEnum,
    ): void {
        const isOwner = String(userIdByListing) === String(userId);
        const isStaff = [
            PlatformRoleEnum.ADMIN,
            PlatformRoleEnum.MANAGER,
        ].includes(role);

        if (!isOwner && !isStaff) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Access denied: You do not have permission to perform this action",
            );
        }
    }
}

export const listingService = new ListingService();
