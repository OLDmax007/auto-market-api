import { model, Schema } from "mongoose";

import { ListingStaticsType } from "../../types/listing-statics.type";

const ListingStaticsSchema = new Schema(
    {
        listingId: {
            type: Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        views: {
            all: { type: Number, default: 0 },
            day: { type: Number, default: 0 },
            week: { type: Number, default: 0 },
            month: { type: Number, default: 0 },
        },
    },
    { timestamps: true, versionKey: false },
);

export const ListingStatics = model<ListingStaticsType>(
    "listings-statics",
    ListingStaticsSchema,
);
