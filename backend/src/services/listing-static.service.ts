import { HttpStatusEnum } from "../enums/http-status.enum";
import { PeriodEnum } from "../enums/period.enum";
import { ApiError } from "../errors/api.error";
import { listingStaticRepository } from "../repositories/listing-static.repository";
import {
    ListingAveragePriceByLocationType,
    ListingStaticsCreateDtoType,
    ListingStaticsType,
} from "../types/listing-statics.type";
import { listingService } from "./listing.service";
import { marketAnalyticsService } from "./market-analytics.service";

class ListingStaticsService {
    async getPremiumStatsByListingId(listingId: string): Promise<{
        views: ListingStaticsType["views"];
        averagePrice: ListingAveragePriceByLocationType;
    }> {
        const { model, make, country, region, city } =
            await listingService.getById(listingId);

        const { views } =
            await listingStaticService.getViewsByListingId(listingId);

        const avgPrices =
            await marketAnalyticsService.getAveragePriceByLocations({
                model,
                make,
                country,
                region,
                city,
            });

        return {
            views,
            averagePrice: avgPrices,
        };
    }

    public async getViewsByListingId(listingId: string) {
        const stats =
            await listingStaticRepository.getViewsByListingId(listingId);
        if (!stats) {
            throw new ApiError(
                HttpStatusEnum.NOT_FOUND,
                "Listing statistic not found",
            );
        }
        return stats;
    }

    public async createViews(dto: ListingStaticsCreateDtoType) {
        return listingStaticRepository.createViews(dto);
    }

    public async incrementViewsByListingId(listingId: string) {
        await this.getViewsByListingId(listingId);
        await listingStaticRepository.incrementViewsByListingId(listingId);
    }

    public async resetViews(period: PeriodEnum) {
        if (!period) {
            throw new ApiError(HttpStatusEnum.BAD_REQUEST, "Period not found");
        }
        await listingStaticRepository.resetViews(period);
    }
}

export const listingStaticService = new ListingStaticsService();
