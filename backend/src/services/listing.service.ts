import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingCreateDtoType,
    ListingModerationResultType,
    ListingType,
} from "../types/listing.type";
import { carService } from "./car.service";
import { listingStaticService } from "./listing-static.service";
import { locationService } from "./location.service";
import { pricingService } from "./pricing.service";
import { profanityService } from "./profanity.service";
import { userService } from "./user.service";

class ListingService {
    public getAll(): Promise<ListingType[]> {
        return listingRepository.getAll();
    }

    public async getById(id: string): Promise<ListingType> {
        const listing = await listingRepository.getById(id);
        if (!listing) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Listing not found");
        }

        await listingStaticService.incrementViewsByListingId(listing._id);

        return listing;
    }

    public async create(
        userId: string,
        { enteredPrice: { amount, currency }, ...newDto }: ListingCreateDtoType,
    ): Promise<{
        listing: ListingType;
        moderation: ListingModerationResultType;
    }> {
        const { cities } = await locationService.getCitiesByRegion(
            newDto.region,
        );
        if (!cities.includes(newDto.city)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `City '${newDto.city}' does not exist in region '${newDto.region}'`,
            );
        }

        const { make, models } = await carService.getModelsByMake(newDto.make);
        if (!models.includes(newDto.model)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                `Model '${newDto.model}' does not exist for make '${make}'`,
            );
        }

        const { organizationId } = await userService.getById(userId);

        const prices = await pricingService.calculateListingPrices(
            amount,
            currency,
        );

        if (!prices.length) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "PRICING_CALCULATION_FAILED",
            );
        }

        const moderation = await this.checkListingForProfanity(
            newDto.title,
            newDto.description,
            -1,
        );

        const listing = await listingRepository.create({
            userId,
            organizationId,
            prices,
            publishedAt: new Date(),
            isActive: moderation.isActive,
            profanityCheckAttempts: moderation.profanityCheckAttempts,
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

        return {
            listing,
            moderation,
        };
    }

    public async updateById(
        id: string,
        { enteredPrice, ...newDto }: Partial<ListingCreateDtoType>,
    ): Promise<ListingType> {
        const listing = await this.getById(id);
        if ((listing.profanityCheckAttempts ?? 0) >= 3) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "PROFANITY_ATTEMPTS_EXCEEDED",
            );
        }

        const { isActive, profanityCheckAttempts } =
            await this.checkListingForProfanity(
                newDto.title,
                newDto.description,
                listing.profanityCheckAttempts,
            );

        const updateDto: Partial<ListingCreateDbType> = {
            ...newDto,
            isActive,
            profanityCheckAttempts,
        };

        if (enteredPrice) {
            const { amount, currency } = enteredPrice;
            updateDto.prices = await pricingService.calculateListingPrices(
                amount,
                currency,
            );
        }

        return listingRepository.updateById(id, { ...updateDto });
    }

    public deleteById(id: string): Promise<ListingType> {
        return listingRepository.deleteById(id);
    }

    public async checkListingForProfanity(
        title: string,
        description: string,
        currentAttempts: number = 0,
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
}

export const listingService = new ListingService();
