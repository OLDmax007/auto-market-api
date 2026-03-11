import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { listingQueryStaffParams } from "../schemas/listing.schema";

export const listingStaffPaths: OpenAPIV3.PathsObject = {
    "/staff/listings": {
        get: {
            tags: ["Staff - Listings"],
            summary: "Get all listings (Admin/Manager only)",
            security: [{ bearerAuth: [] }],
            parameters: listingQueryStaffParams,
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Paginated list of all listings",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedListingResponse",
                            },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: {
                    description: "Forbidden - Staff access required",
                },
            },
        },
    },
    "/staff/listings/{listingId}": {
        get: {
            tags: ["Staff - Listings"],
            summary: "Get full listing details",
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
                    description: "Full listing data retrieved",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "Listing not found",
                },
            },
        },
        patch: {
            tags: ["Staff - Listings"],
            summary: "Full update by admin",
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
                            $ref: "#/components/schemas/ListingAdminUpdateDto",
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Updated successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid input or profanity detected",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "Listing not found",
                },
            },
        },
        delete: {
            tags: ["Staff - Listings"],
            summary: "Delete listing",
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
                [HttpStatusEnum.NO_CONTENT]: { description: "Listing deleted" },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "Listing not found",
                },
            },
        },
    },
    "/staff/listings/manager/{listingId}": {
        patch: {
            tags: ["Staff - Listings"],
            summary: "Update title/description by manager",
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
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ListingManagerUpdateDto",
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Content updated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description:
                        "Missing required fields or profanity detected",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
            },
        },
    },
    "/staff/listings/{listingId}/activate": {
        patch: {
            tags: ["Staff - Listings"],
            summary: "Activate listing",
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
                    description: "Listing activated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: {
                    description:
                        "Forbidden - Profanity check might have failed",
                },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "Listing not found",
                },
            },
        },
    },
    "/staff/listings/{listingId}/deactivate": {
        patch: {
            tags: ["Staff - Listings"],
            summary: "Deactivate listing",
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
                    description: "Listing deactivated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Listing" },
                        },
                    },
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
                [HttpStatusEnum.FORBIDDEN]: { description: "Forbidden" },
            },
        },
    },
};
