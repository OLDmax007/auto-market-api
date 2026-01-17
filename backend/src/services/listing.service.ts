import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingCreateDtoType,
    ListingModerationResultType,
    ListingType,
} from "../types/listing.type";
import { pricingService } from "./pricing.service";
import { profanityService } from "./profanity.service";
import { userService } from "./user.service";

class ListingService {
    public getAll(): Promise<ListingType[]> {
        return listingRepository.getAll();
    }

    public getById(id: string): Promise<ListingType> {
        return listingRepository.getById(id);
    }
    public async create(
        userId: string,
        { enteredPrice: { amount, currency }, ...newDto }: ListingCreateDtoType,
    ): Promise<ListingType> {
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

        return listingRepository.create({
            userId,
            organizationId,
            prices,
            publishedAt: new Date(),
            ...newDto,
            profanityCheckAttempts: 0,
            isActive: false,
        });
    }

    public async updateById(
        id: string,
        { enteredPrice, ...newDto }: Partial<ListingCreateDtoType>,
    ): Promise<ListingType> {
        const updateDto: Partial<ListingCreateDbType> = { ...newDto };

        if (enteredPrice) {
            const { amount, currency } = enteredPrice;
            updateDto.prices = await pricingService.calculateListingPrices(
                amount,
                currency,
            );
        }

        return listingRepository.updateById(id, updateDto);
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
