import { model, Schema } from "mongoose";

import { CarMakeEnum } from "./car.enum";
import { CarMapType } from "./car.type";

const CarSchema = new Schema(
    {
        make: {
            type: String,
            enum: CarMakeEnum,
            required: true,
            unique: true,
        },
        models: [
            {
                type: String,
                required: true,
            },
        ],
    },
    { timestamps: true, versionKey: false },
);

export const Car = model<CarMapType>("cars", CarSchema);
