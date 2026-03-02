import { Listing } from "../models/listing.model";
import {
    ListingAveragePriceByLocationType,
    MarketAnalyticsDtoType,
} from "../types/listing-statics.type";

class MarketAnalyticsRepository {
    public async getAveragePriceByLocations(
        dto: MarketAnalyticsDtoType,
    ): Promise<ListingAveragePriceByLocationType> {
        const { make, model, country, region, city } = dto;

        const result = await Listing.aggregate([
            { $match: { isActive: true, make, model } },
            { $unwind: "$prices" },
            { $match: { "prices.mainCurrency": true } },
            {
                $facet: {
                    city: [
                        { $match: { city } },
                        {
                            $group: {
                                _id: null,
                                averagePrice: { $avg: "$prices.amount" },
                                listingCount: { $sum: 1 },
                            },
                        },
                    ],
                    region: [
                        { $match: { region } },
                        {
                            $group: {
                                _id: null,
                                averagePrice: { $avg: "$prices.amount" },
                                listingCount: { $sum: 1 },
                            },
                        },
                    ],
                    country: [
                        { $match: { country } },
                        {
                            $group: {
                                _id: null,
                                averagePrice: { $avg: "$prices.amount" },
                                listingCount: { $sum: 1 },
                            },
                        },
                    ],
                },
            },
        ]);

        const data = result[0];
        const defaultValue = { averagePrice: 0, listingCount: 0 };

        return {
            city: data.city[0] || defaultValue,
            region: data.region[0] || defaultValue,
            country: data.country[0] || defaultValue,
        };
    }
}

export const marketAnalyticsRepository = new MarketAnalyticsRepository();
