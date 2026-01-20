import { model, Schema } from "mongoose";

import { LocationMapType } from "../types/location.type";

const LocationSchema = new Schema({
    region: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    cities: [
        {
            type: String,
            required: true,
        },
    ],
});

export const LocationModel = model<LocationMapType>(
    "locations",
    LocationSchema,
);
