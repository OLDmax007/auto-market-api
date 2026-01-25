import { BaseType } from "./base.type";

export type ListingStaticsType = {
    _id: string;
    listingId: string;
    views: {
        all: number;
        day: number;
        week: number;
        month: number;
    };
} & BaseType;

export type ListingStaticsCreateDtoType = Pick<
    ListingStaticsType,
    "views" | "listingId"
>;

type ListingAveragePriceType = {
    averagePrice: number;
    listingCount: number;
};

export type ListingAveragePriceByLocationType = {
    city: ListingAveragePriceType;
    region: ListingAveragePriceType;
    country: ListingAveragePriceType;
};

export type MarketAnalyticsDtoType = {
    make: string;
    model: string;
    city: string;
    region: string;
    country: string;
};
