import { model, Schema } from "mongoose";

import { EngineEnum, TransmissionEnum } from "../enums/car.enum";
import { CarListingType } from "../types/car-listing.type";

const carListingSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        unique: true,
        required: true,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },

    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true, min: 1886 },
    mileage_km: { type: Number, required: true, min: 0 },
    engineType: {
        type: String,
        required: true,
        enum: EngineEnum,
    },
    transmission: {
        type: String,
        required: true,
        enum: TransmissionEnum,
    },

    price_usd: { type: Number, required: true, min: 0 },
    city: { type: String, required: true },

    main_photo_url: { type: String, required: true },
    date_posted: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
});

export const CarListing = model<CarListingType>(
    "car-listings",
    carListingSchema,
);
