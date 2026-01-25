import { model, Schema } from "mongoose";

import { CarMarkEnum } from "../enums/car.enum";
import { CarMapType } from "../types/car.type";

const CarSchema = new Schema({
    make: {
        type: String,
        enum: CarMarkEnum,
        required: true,
        unique: true,
    },
    models: [
        {
            type: String,
            required: true,
        },
    ],
});

export const Car = model<CarMapType>("cars", CarSchema);
