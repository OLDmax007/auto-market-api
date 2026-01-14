import { model, Schema } from "mongoose";

import {
    BmwModelsEnum,
    CarCategoryEnum,
    CarMarkEnum,
    DaewooModelsEnum,
    EngineEnum,
    TransmissionEnum,
} from "../../enums/car.enum";
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
        category: {
            type: String,
            enum: CarCategoryEnum,
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        make: { type: String, enum: CarMarkEnum, required: true },
        model: {
            type: String,
            enum: BmwModelsEnum || DaewooModelsEnum,
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
                amount: { type: Number, required: true },
                currency: { type: String, required: true },
            },
        ],
        city: { type: String, required: true },
        main_photo_url: { type: String, required: true },
        profanityCheckAttempts: { type: Number, default: 0 },
        isActive: { type: Boolean, default: false },
        publishedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    },
);

export const Listing = model<ListingType>("Listing", ListingSchema);
