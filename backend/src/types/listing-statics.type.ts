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
