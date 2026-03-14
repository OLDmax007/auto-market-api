import { OpenAPIV3 } from "openapi-types";

import { SubscriptionPlanEnum } from "../../../modules/subscription/enums/subscription-plan.enum";

export const subscriptionSchema: Record<string, OpenAPIV3.SchemaObject> = {
    Subscription: {
        type: "object",
        properties: {
            _id: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0d4" },
            userId: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0d1" },
            planType: {
                type: "string",
                enum: Object.values(SubscriptionPlanEnum),
                example: SubscriptionPlanEnum.PREMIUM,
            },
            price: {
                type: "object",
                properties: {
                    amount: { type: "number", example: 29.99 },
                    currency: { type: "string", example: "USD" },
                },
            },
            activeFrom: {
                type: "string",
                format: "date-time",
                example: "2024-03-01T10:00:00Z",
            },
            activeTo: {
                type: "string",
                format: "date-time",
                nullable: true,
                example: "2024-04-01T10:00:00Z",
            },
            isActive: { type: "boolean", example: true },
            isDeleted: { type: "boolean", example: false },
            deletedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                example: null,
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2024-03-01T10:00:00Z",
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2024-03-01T10:00:00Z",
            },
        },
    },

    SubscriptionCreate: {
        type: "object",
        required: ["userId"],
        properties: {
            userId: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0d1" },
        },
    },
};
