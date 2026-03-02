import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { ensureIsActive } from "../../../common/helpers/ensure.helper";
import { PeriodEnum } from "../../location/enums/period.enum";
import { SubscriptionPlanEnum } from "../../subscription/enums/subscription-plan.enum";
import { subscriptionService } from "../../subscription/subscription.service";
import { PlatformRoleEnum } from "../../user/enums/platform-role.enum";
import { userAccessService } from "../../user/services/user-access.service";
import { listingStaticRepository } from "../repositories/listing-static.repository";
import {
    ListingAveragePriceByLocationType,
    ListingStaticsCreateDtoType,
    ListingStaticsType,
} from "../types/listing-statics.type";
import { listingService } from "./listing.service";
import { marketAnalyticsService } from "./market-analytics.service";

class ListingStaticsService {
    async getPremiumStatsByListingId(
        userId: string,
        subscriptionId: string,
        listingId: string,
        initiatorRole: PlatformRoleEnum,
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

        const isStaff = [
            PlatformRoleEnum.ADMIN,
            PlatformRoleEnum.MANAGER,
        ].includes(initiatorRole);

        if (!isStaff) {
            userAccessService.checkAccountOwnership(
                userId,
                userIdByListing,
                "listing",
            );

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
