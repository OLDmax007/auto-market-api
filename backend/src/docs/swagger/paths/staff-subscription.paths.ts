import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { SubscriptionPlanEnum } from "../../../modules/subscription/enums/subscription-plan.enum";

export const subscriptionStaffPaths: OpenAPIV3.PathsObject = {
    "/staff/subscriptions/{userId}": {
        patch: {
            tags: ["Staff - Subscriptions"],
            summary: "Set user subscription plan",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID of the user to update subscription",
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["newPlan"],
                            properties: {
                                newPlan: {
                                    type: "string",
                                    enum: Object.values(SubscriptionPlanEnum),
                                    example: SubscriptionPlanEnum.PREMIUM,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Subscription plan updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Subscription",
                            },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid input data or validation failed",
                },
                [HttpStatusEnum.UNAUTHORIZED]: {
                    description:
                        "Unauthorized - Access token is missing or invalid",
                },
                [HttpStatusEnum.FORBIDDEN]: {
                    description: "Forbidden - Missing staff permissions",
                },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "User or subscription not found",
                },
            },
        },
    },
    "/staff/subscriptions/{userId}/activate": {
        patch: {
            tags: ["Staff - Subscriptions"],
            summary: "Activate user subscription",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Subscription activated",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Subscription",
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: { description: "User not found" },
            },
        },
    },
    "/staff/subscriptions/{userId}/deactivate": {
        patch: {
            tags: ["Staff - Subscriptions"],
            summary: "Deactivate user subscription",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Subscription deactivated",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Subscription",
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: { description: "User not found" },
            },
        },
    },
};
