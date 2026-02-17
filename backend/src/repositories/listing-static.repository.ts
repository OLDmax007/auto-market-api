import { PeriodEnum } from "../enums/period.enum";
import { ListingStatics } from "../models/listing/listing-statics.model";
import {
    ListingStaticsCreateDtoType,
    ListingStaticsType,
} from "../types/listing-statics.type";

class ListingStaticsRepository {
    public getViewsByListingId(listingId: string): Promise<ListingStaticsType> {
        return ListingStatics.findOne({ listingId });
    }

    public createViews(dto: ListingStaticsCreateDtoType) {
        return ListingStatics.create(dto);
    }

    public incrementViewsByListingId(listingId: string) {
        return ListingStatics.findOneAndUpdate(
            { listingId },
            {
                $inc: {
                    "views.all": 1,
                    "views.day": 1,
                    "views.week": 1,
                    "views.month": 1,
                },
            },
            { new: true, projection: { views: 1, listingId: 1 } },
        );
    }

    public resetViews(period: PeriodEnum) {
        return ListingStatics.updateMany(
            {},
            { $set: { [`views.${period}`]: 50 } },
        );
    }
}

export const listingStaticRepository = new ListingStaticsRepository();
