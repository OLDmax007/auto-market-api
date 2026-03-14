import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";

export const userPaths: OpenAPIV3.PathsObject = {
    "/users/{userId}": {
        get: {
            tags: ["Users"],
            summary: "Get public user profile by ID",
            description:
                "Retrieve public information about a user. Sensitive data like email or role is hidden.",
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "The unique identifier of the user",
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Public profile data retrieved successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserPublic" },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid User ID format",
                },
                [HttpStatusEnum.NOT_FOUND]: {
                    description: "User with the provided ID does not exist",
                },
            },
        },
    },
};
