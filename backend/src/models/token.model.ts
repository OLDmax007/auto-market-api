import { model, Schema } from "mongoose";

import { TokenType } from "../types/token.type";

const tokenSchema = new Schema(
    {
        accessToken: { type: String, unique: true, required: true },
        refreshToken: { type: String, unique: true, required: true },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Token = model<TokenType>("tokens", tokenSchema);
