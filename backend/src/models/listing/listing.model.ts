import { model, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { imagesLinks } from "../../constants/images-links";
import {
    CarMarkEnum,
    EngineEnum,
    TransmissionEnum,
} from "../../enums/car.enum";
import { CountryEnum } from "../../enums/country-enum";
import { RegionEnum } from "../../enums/region-enum";
import { ListingType } from "../../types/listing.type";

export const listingSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        make: { type: String, enum: CarMarkEnum, required: true },
        model: {
            type: String,
            required: true,
        },
        year: { type: Number, required: true },
        mileage_km: { type: Number, required: true },
        engineType: {
            type: String,
            enum: EngineEnum,
            required: true,
        },
        transmission: {
            type: String,
            enum: TransmissionEnum,
            required: true,
        },
        prices: [
            {
                _id: false,
                mainCurrency: { type: Boolean },
                rate: { type: Number },
                amount: { type: Number, required: true },
                currency: { type: String, required: true },
            },
        ],
        country: {
            type: String,
            enum: CountryEnum,
            default: CountryEnum.UKRAINE,
        },
        region: { type: String, enum: RegionEnum, required: true },
        city: { type: String, required: true },
        main_photo_url: {
            type: String,
            default: imagesLinks.default_listing_image,
        },
        profanityCheckAttempts: { type: Number, default: 0 },
        isProfanity: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false },
        publishedAt: { type: Date, default: Date.now() },
    },
    { timestamps: true, versionKey: false },
);

listingSchema.plugin(mongoosePaginate);

export const Listing = model<ListingType, PaginateModel<ListingType>>(
    "listings",
    listingSchema,
);
