import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { listingRepository } from "../repositories/listing.repository";
import { ListingCreateDtoType, ListingType } from "../types/listing.type";
import { pricingService } from "./pricing.service";
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
        });
    }
}

export const listingService = new ListingService();
