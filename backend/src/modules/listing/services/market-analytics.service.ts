import { marketAnalyticsRepository } from "../repositories/market-analytics.repository";
import {
    ListingAveragePriceByLocationType,
    MarketAnalyticsDtoType,
} from "../types/listing-statics.type";

export class MarketAnalyticsService {
    public async getAveragePriceByLocations(
        dto: MarketAnalyticsDtoType,
    ): Promise<ListingAveragePriceByLocationType> {
        const avgPrices =
            await marketAnalyticsRepository.getAveragePriceByLocations(dto);

        return {
            city: {
                averagePrice: Math.round(avgPrices.city.averagePrice),
                listingCount: avgPrices.city.listingCount,
            },
            region: {
                averagePrice: Math.round(avgPrices.region.averagePrice),
                listingCount: avgPrices.region.listingCount,
            },
            country: {
                averagePrice: Math.round(avgPrices.country.averagePrice),
                listingCount: avgPrices.country.listingCount,
            },
        };
    }
}

export const marketAnalyticsService = new MarketAnalyticsService();
