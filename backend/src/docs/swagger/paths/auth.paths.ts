import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";

export const authPaths: OpenAPIV3.PathsObject = {
    "/auth/sign-up": {
        post: {
            tags: ["Auth"],
            summary: "Sign up",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UserCreateDto" },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.CREATED]: {
                    description: "User created",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: { $ref: "#/components/schemas/User" },
                                    tokens: {
                                        $ref: "#/components/schemas/Tokens",
                                    },
                                },
                            },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Validation failed (e.g. weak password)",
                },
                [HttpStatusEnum.CONFLICT]: {
                    description: "User with this email already exists",
                },
            },
        },
    },
    "/auth/sign-in": {
        post: {
            tags: ["Auth"],
            summary: "Sign in",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UserLoginDto" },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: { $ref: "#/components/schemas/User" },
                                    tokens: {
                                        $ref: "#/components/schemas/Tokens",
                                    },
                                },
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: {
                    description: "Invalid email or password",
                },
            },
        },
    },
    "/auth/refresh": {
        post: {
            tags: ["Auth"],
            summary: "Refresh tokens",
            description: "Send Refresh Token in Authorization header",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Tokens refreshed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Tokens" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: {
                    description: "Invalid or expired refresh token",
                },
            },
        },
    },
    "/auth/verify": {
        patch: {
            tags: ["Auth"],
            summary: "Verify email",
            parameters: [
                {
                    name: "token",
                    in: "query",
                    required: true,
                    description: "Action token from email",
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Email verified successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid or expired verification token",
                },
            },
        },
    },
    "/auth/verify/resend": {
        post: {
            tags: ["Auth"],
            summary: "Resend verification email",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.OK]: { description: "Verification email sent" },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
    "/auth/recovery-password": {
        post: {
            tags: ["Auth"],
            summary: "Request password recovery",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email"],
                            properties: {
                                email: {
                                    type: "string",
                                    format: "email",
                                    example: "test@gmail.com",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: { description: "Recovery email sent" },
                [HttpStatusEnum.NOT_FOUND]: { description: "User not found" },
            },
        },
    },
    "/auth/reset-password": {
        patch: {
            tags: ["Auth"],
            summary: "Reset password with token",
            parameters: [
                {
                    name: "token",
                    in: "query",
                    required: true,
                    description: "Action token from email",
                    schema: { type: "string" },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["password"],
                            properties: {
                                password: {
                                    type: "string",
                                    format: "password",
                                    example: "NewPassword123!",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Password updated and user logged in",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: { $ref: "#/components/schemas/User" },
                                    tokens: {
                                        $ref: "#/components/schemas/Tokens",
                                    },
                                },
                            },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid token or password format",
                },
            },
        },
    },
    "/auth/logout": {
        delete: {
            tags: ["Auth"],
            summary: "Logout",
            description: "Send Refresh Token in Authorization header",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.NO_CONTENT]: { description: "Logged out" },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
    "/auth/logout-all": {
        delete: {
            tags: ["Auth"],
            summary: "Logout from all devices",
            description: "Send Refresh Token in Authorization header",
            security: [{ bearerAuth: [] }],
            responses: {
                [HttpStatusEnum.NO_CONTENT]: {
                    description: "Logged out from all devices",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
};
