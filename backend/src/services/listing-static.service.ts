import { HttpStatusEnum } from "../enums/http-status.enum";
import { PeriodEnum } from "../enums/period.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { ApiError } from "../errors/api.error";
import { ensureIsActive } from "../helpers/ensure.helper";
import { listingStaticRepository } from "../repositories/listing-static.repository";
import {
    ListingAveragePriceByLocationType,
    ListingStaticsCreateDtoType,
    ListingStaticsType,
} from "../types/listing-statics.type";
import { listingService } from "./listing.service";
import { marketAnalyticsService } from "./market-analytics.service";
import { subscriptionService } from "./subscription.service";

class ListingStaticsService {
    async getPremiumStatsByListingId(
        userId: string,
        subscriptionId: string,
        listingId: string,
    ): Promise<{
        views: ListingStaticsType["views"];
        averagePrice: ListingAveragePriceByLocationType;
    }> {
        const { isActive, planType } =
            await subscriptionService.getById(subscriptionId);

        const {
            model,
            make,
            country,
            region,
            city,
            userId: userIdByListing,
        } = await listingService.getById(listingId);

        if (String(userIdByListing) !== String(userId)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "You can only view statistics for your own listings.",
            );
        }

        ensureIsActive(
            isActive,
            "Your subscription is deactivated. Please renew!",
        );

        if (planType === PlanTypeEnum.BASIC) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Upgrade premium plan!",
            );
        }

        const [stats, avgPrices] = await Promise.all([
            this.getViewsByListingId(listingId),
            marketAnalyticsService.getAveragePriceByLocations({
                model,
                make,
                country,
                region,
                city,
            }),
        ]);

        return {
            views: stats.views,
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
