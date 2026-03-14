import { PeriodEnum } from "../../location/enums/period.enum";
import { ListingStatics } from "../models/listing-statics.model";
import {
    ListingStaticsCreateDtoType,
    ListingStaticsType,
} from "../types/listing-statics.type";

class ListingStaticsRepository {
    public getViewsByListingId(listingId: string): Promise<ListingStaticsType> {
        return ListingStatics.findOne({ listingId });
    }

    public createViews(
        dto: ListingStaticsCreateDtoType,
    ): Promise<ListingStaticsType> {
        return ListingStatics.create(dto);
    }

    public incrementViewsByListingId(
        listingId: string,
    ): Promise<ListingStaticsType> {
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

    public async resetViews(period: PeriodEnum): Promise<void> {
        await ListingStatics.updateMany(
            {},
            { $set: { [`views.${period}`]: 0 } },
        );
    }
}

export const listingStaticRepository = new ListingStaticsRepository();
