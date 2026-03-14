import { OpenAPIV3 } from "openapi-types";

import { basePaginationParams } from "./common.schema";

export const userSchema: Record<string, OpenAPIV3.SchemaObject> = {
    User: {
        type: "object",
        properties: {
            _id: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0d1" },
            platformRoleId: {
                type: "string",
                example: "65f1a2b3c4d5e6f7a8b9c0d2",
            },
            organizationId: { type: "string", nullable: true, example: null },
            subscriptionId: {
                type: "string",
                example: "65f1a2b3c4d5e6f7a8b9c0d3",
            },
            firstName: { type: "string", example: "Max" },
            lastName: { type: "string", example: "Pes" },
            age: { type: "integer", example: 28 },
            email: {
                type: "string",
                format: "email",
                example: "max.pes@test.com",
            },
            avatar: {
                type: "string",
                example:
                    "https://auto-market.s3.eu-central-1.amazonaws.com/default/avatar.png",
            },
            balance: {
                type: "object",
                properties: {
                    amount: { type: "number", example: 1500.5 },
                    currency: { type: "string", example: "USD" },
                },
            },
            isActive: { type: "boolean", example: true },
            isVerified: { type: "boolean", example: true },
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
                example: "2024-01-01T12:00:00Z",
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2024-01-02T12:00:00Z",
            },
        },
    },

    UserPublic: {
        type: "object",
        properties: {
            _id: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0d1" },
            organizationId: { type: "string", nullable: true, example: null },
            firstName: { type: "string", example: "Max" },
            lastName: { type: "string", example: "Pes" },
            age: { type: "integer", example: 28 },
            avatar: {
                type: "string",
                example:
                    "https://auto-market.s3.eu-central-1.amazonaws.com/default/avatar.png",
            },
        },
    },

    UserLoginDto: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: {
                type: "string",
                format: "email",
                example: "max.pes@test.com",
            },
            password: {
                type: "string",
                format: "password",
                example: "Test-password123",
            },
        },
    },

    UserCreateDto: {
        type: "object",
        required: ["firstName", "lastName", "age", "email", "password"],
        properties: {
            firstName: { type: "string", example: "Max" },
            lastName: { type: "string", example: "Pes" },
            age: { type: "integer", example: 28 },
            email: {
                type: "string",
                format: "email",
                example: "max.pes@test.com",
            },
            password: {
                type: "string",
                format: "password",
                example: "Test-password123",
            },
        },
    },

    UserUpdateDto: {
        type: "object",
        properties: {
            firstName: { type: "string", example: "Max" },
            lastName: { type: "string", example: "Pes" },
            age: { type: "integer", example: 29 },
        },
    },

    UserUpdateByAdminDto: {
        type: "object",
        properties: {
            firstName: { type: "string", example: "Max" },
            lastName: { type: "string", example: "Pes" },
            email: {
                type: "string",
                format: "email",
                example: "max.pes@test.com",
            },
            age: { type: "integer", example: 30 },
            isVerified: { type: "boolean", example: true },
        },
    },

    PaginatedUserResponse: {
        allOf: [
            { $ref: "#/components/schemas/PaginationMeta" },
            {
                type: "object",
                properties: {
                    docs: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                    },
                },
            },
        ],
    },
};

export const userQueryStaffParams: OpenAPIV3.ParameterObject[] = [
    ...basePaginationParams,
    {
        name: "userId",
        in: "query",
        schema: { type: "string" },
        description: "Filter by specific user ID",
    },
    {
        name: "isActive",
        in: "query",
        schema: { type: "boolean" },
        example: true,
        description: "Filter by user account status (active/blocked)",
    },
];
