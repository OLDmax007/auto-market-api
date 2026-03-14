import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";

export const mePaths: OpenAPIV3.PathsObject = {
    "/me": {
        get: {
            tags: ["Me"],
            summary: "Get my profile",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "User profile data",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
        patch: {
            tags: ["Me"],
            summary: "Update my profile",
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UserUpdateDto" },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Profile updated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid update data",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
    "/me/close": {
        delete: {
            tags: ["Me"],
            summary: "Close account (Soft delete)",
            description:
                "Deactivates the user account and returns the deactivated user object",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Account successfully closed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
            },
        },
    },
    "/me/become-seller": {
        patch: {
            tags: ["Me"],
            summary: "Become a seller",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Role updated to seller",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.CONFLICT]: {
                    description: "User is already a seller",
                },
            },
        },
    },
    "/me/upgrade-plan": {
        patch: {
            tags: ["Me"],
            summary: "Upgrade to Premium plan",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Subscription upgraded to Premium",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Subscription",
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Insufficient balance or invalid request",
                },
            },
        },
    },
    "/me/top-up-balance": {
        patch: {
            tags: ["Me"],
            summary: "Top up wallet balance",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CurrencyAmount" },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Balance updated",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CurrencyAmount",
                            },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid amount or currency",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
    "/me/avatar": {
        post: {
            tags: ["Me"],
            summary: "Upload avatar",
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                avatar: { type: "string", format: "binary" },
                            },
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.CREATED]: {
                    description: "Avatar uploaded",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid file format or size",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
        delete: {
            tags: ["Me"],
            summary: "Delete avatar",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Avatar deleted",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
};
