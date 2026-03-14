import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { ensureIsActive } from "../../../common/helpers/ensure.helper";
import { PeriodEnum } from "../../location/enums/period.enum";
import { SubscriptionPlanEnum } from "../../subscription/enums/subscription-plan.enum";
import { subscriptionService } from "../../subscription/subscription.service";
import { userAccessService } from "../../user/services/user-access.service";
import { listingStaticRepository } from "../repositories/listing-static.repository";
import { ListingInitiatorType } from "../types/listing.type";
import {
    ListingAveragePriceByLocationType,
    ListingStaticsCreateDtoType,
    ListingStaticsType,
} from "../types/listing-statics.type";
import { listingService } from "./listing.service";
import { marketAnalyticsService } from "./market-analytics.service";

class ListingStaticsService {
    async getPremiumStatsByListingId({
        userId,
        subscriptionId,
        initiatorRole,
        listingId,
    }: Omit<ListingInitiatorType, "initiatorId"> & {
        userId: string;
        subscriptionId: string;
    }): Promise<{
        views: ListingStaticsType["views"];
        averagePrice: ListingAveragePriceByLocationType;
    }> {
        const listing = await listingService.getById(listingId);

        if (!userAccessService.isStaff(initiatorRole)) {
            userAccessService.checkOwnership(listing.userId, userId, "listing");
            const { isActive, planType } =
                await subscriptionService.getById(subscriptionId);

            ensureIsActive(
                isActive,
                "Your subscription is deactivated. Please renew!",
            );

            if (planType === SubscriptionPlanEnum.BASIC) {
                throw new ApiError(
                    HttpStatusEnum.FORBIDDEN,
                    "Upgrade premium plan!",
                );
            }
        }

        const [stats, avgPrices] = await Promise.all([
            this.getViewsByListingId(listingId),
            marketAnalyticsService.getAveragePriceByLocations({
                model: listing.model,
                make: listing.make,
                country: listing.country,
                region: listing.region,
                city: listing.city,
            }),
        ]);

        return {
            views: stats.views,
            averagePrice: avgPrices,
        };
    }

    public async getViewsByListingId(
        listingId: string,
    ): Promise<ListingStaticsType> {
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

    public async createViews(
        dto: ListingStaticsCreateDtoType,
    ): Promise<ListingStaticsType> {
        return listingStaticRepository.createViews(dto);
    }

    public async incrementViewsByListingId(listingId: string): Promise<void> {
        await this.getViewsByListingId(listingId);
        await listingStaticRepository.incrementViewsByListingId(listingId);
    }

    public async resetViews(period: PeriodEnum): Promise<void> {
        if (!period) {
            throw new ApiError(HttpStatusEnum.BAD_REQUEST, "Period not found");
        }
        await listingStaticRepository.resetViews(period);
    }
}

export const listingStaticService = new ListingStaticsService();
