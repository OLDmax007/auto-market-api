import { randomUUID } from "node:crypto";

import { model, Schema } from "mongoose";

import { TokenType } from "./token.type";

const tokenSchema = new Schema(
    {
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        sessionId: {
            type: String,
            unique: true,
            required: true,
            default: () => randomUUID(),
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Token = model<TokenType>("tokens", tokenSchema);
