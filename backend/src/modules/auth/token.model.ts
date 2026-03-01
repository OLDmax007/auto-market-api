import { model, Schema } from "mongoose";

import { TokenType } from "./token.type";

const tokenSchema = new Schema(
    {
        accessToken: { type: String, unique: true, required: true },
        refreshToken: { type: String, unique: true, required: true },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Token = model<TokenType>("tokens", tokenSchema);
