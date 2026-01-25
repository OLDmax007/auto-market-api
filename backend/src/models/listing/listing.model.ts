import { model, Schema } from "mongoose";

import {
    CarMarkEnum,
    EngineEnum,
    TransmissionEnum,
} from "../../enums/car.enum";
import { CountryEnum } from "../../enums/country-enum";
import { RegionEnum } from "../../enums/region-enum";
import { ListingType } from "../../types/listing.type";

export const ListingSchema = new Schema(
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
        main_photo_url: { type: String, required: true },
        profanityCheckAttempts: { type: Number, default: 0 },
        isActive: { type: Boolean, default: false },
        publishedAt: { type: Date, default: null },
    },
    { timestamps: true, versionKey: false },
);

export const Listing = model<ListingType>("listings", ListingSchema);
