import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { userQueryStaffParams } from "../schemas/user.schema";

export const userStaffPaths: OpenAPIV3.PathsObject = {
    "/staff/users": {
        get: {
            tags: ["Staff - Users"],
            summary: "Get paginated users list",
            security: [{ bearerAuth: [] }],
            parameters: userQueryStaffParams,
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedUserResponse",
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: {
                    description: "Forbidden - Staff only",
                },
            },
        },
    },
    "/staff/users/{userId}": {
        get: {
            tags: ["Staff - Users"],
            summary: "Get user by ID",
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
                    description: "User details retrieved",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: { description: "User not found" },
            },
        },
        patch: {
            tags: ["Staff - Users"],
            summary: "Update user by admin",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UserUpdateByAdminDto",
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "User updated successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid input data",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: { description: "User not found" },
            },
        },
        delete: {
            tags: ["Staff - Users"],
            summary: "Delete user",
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
                [HttpStatusEnum.NO_CONTENT]: {
                    description: "User deleted successfully",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: { description: "User not found" },
            },
        },
    },
    "/staff/users/{userId}/role": {
        patch: {
            tags: ["Staff - Users"],
            summary: "Set user platform role",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["newRole"],
                            properties: {
                                newRole: {
                                    type: "string",
                                    example: "manager",
                                    description: "New platform role name or ID",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Role updated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid role value",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
            },
        },
    },
    "/staff/users/{userId}/activate": {
        patch: {
            tags: ["Staff - Users"],
            summary: "Activate user",
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
                    description: "User activated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: { description: "User not found" },
            },
        },
    },
    "/staff/users/{userId}/deactivate": {
        patch: {
            tags: ["Staff - Users"],
            summary: "Deactivate user",
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
                    description: "User deactivated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/User" },
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
