import { model, Schema } from "mongoose";

import { PrivatBankRateType } from "../types/rate.type";

const RateSchema = new Schema(
    {
        ccy: {
            type: String,
            required: true,
            index: true,
        },
        base_ccy: {
            type: String,
            required: true,
            index: true,
        },
        buy: {
            type: String,
            required: true,
        },
        sale: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Rate = model<PrivatBankRateType>("rates", RateSchema);
