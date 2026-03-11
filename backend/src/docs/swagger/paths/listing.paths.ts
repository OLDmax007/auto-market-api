import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import {
    listingQueryMyParams,
    listingQueryPublicParams,
} from "../schemas/listing.schema";

export const listingPaths: OpenAPIV3.PathsObject = {
    "/listings/public": {
        get: {
            tags: ["Listings"],
            summary: "Get all public listings",
            description: "Retrieve a list of active and verified listings",
            parameters: listingQueryPublicParams,
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Paginated list of public listings",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedListingResponse",
                            },
                        },
                    },
                },
            },
        },
    },
    "/listings/public/{listingId}": {
        get: {
            tags: ["Listings"],
            summary: "Get public listing by ID",
            parameters: [
                {
                    name: "listingId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Listing details",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "Listing not found",
                },
            },
        },
    },
    "/listings": {
        post: {
            tags: ["Listings"],
            summary: "Create a new listing",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ListingCreateDto",
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.CREATED]: {
                    description: "Listing created",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Validation failed or profanity detected",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: {
                    description: "Listing limit reached (for basic users)",
                },
            },
        },
    },
    "/listings/my": {
        get: {
            tags: ["Listings"],
            summary: "Get all my listings",
            security: [{ bearerAuth: [] }],
            parameters: listingQueryMyParams,
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "User's paginated listings",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedListingResponse",
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
    "/listings/my/{listingId}": {
        get: {
            tags: ["Listings"],
            summary: "Get my listing by ID",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "listingId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "User's listing details",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "Listing not found",
                },
            },
        },
    },
    "/listings/{listingId}": {
        patch: {
            tags: ["Listings"],
            summary: "Update my listing",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "listingId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ListingUpdateDto",
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Updated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: { description: "Invalid data" },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Not an owner" },
            },
        },
    },
    "/listings/{listingId}/statistics": {
        get: {
            tags: ["Listings"],
            summary: "Get listing statistics",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "listingId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Stats retrieved",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ListingPremiumStatsResponse",
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: {
                    description: "Access restricted to owner or premium users",
                },
            },
        },
    },
    "/listings/{listingId}/close": {
        patch: {
            tags: ["Listings"],
            summary: "Close listing",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "listingId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Closed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Not an owner" },
            },
        },
    },
    "/listings/{listingId}/poster": {
        post: {
            tags: ["Listings"],
            summary: "Upload poster",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "listingId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                poster: { type: "string", format: "binary" },
                            },
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.CREATED]: {
                    description: "Poster uploaded",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: { description: "Invalid file" },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
        delete: {
            tags: ["Listings"],
            summary: "Delete poster",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "listingId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Poster deleted",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
};
