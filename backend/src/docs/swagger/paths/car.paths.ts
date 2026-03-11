import { OpenAPIV3 } from "openapi-types";

import { HttpStatusEnum } from "../../../common/enums/http-status.enum";

export const carPaths: OpenAPIV3.PathsObject = {
    "/cars/makes": {
        get: {
            tags: ["Car"],
            summary: "Get all car makes",
            description: "Retrieve a list of all supported car manufacturers",
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "List of makes",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CarMakesResponse",
                            },
                        },
                    },
                },
            },
        },
    },
    "/cars/{make}/models": {
        get: {
            tags: ["Car"],
            summary: "Get models by make",
            description: "Retrieve all models for a specific car manufacturer",
            parameters: [
                {
                    name: "make",
                    in: "path",
                    required: true,
                    description: "Car make identifier",
                    schema: { type: "string", example: "BMW" },
                },
            ],
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "List of models",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CarModelsResponse",
                            },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid make parameter",
                },
                [HttpStatusEnum.NOT_FOUND]: { description: "Make not found" },
            },
        },
    },
    "/cars/missing-report/make": {
        post: {
            tags: ["Car"],
            summary: "Report missing car make",
            description:
                "Suggest a new car manufacturer to be added to the system",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/MissingMakeDto" },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Report sent successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Report sent successfully",
                                    },
                                },
                            },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid input data",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
    "/cars/missing-report/model": {
        post: {
            tags: ["Car"],
            summary: "Report missing car model",
            description:
                "Suggest a new car model for an existing manufacturer.",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/MissingModelDto",
                        },
                    },
                },
            },
            responses: {
                [HttpStatusEnum.OK]: {
                    description: "Report sent successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Report sent successfully",
                                    },
                                },
                            },
                        },
                    },
                },
                [HttpStatusEnum.BAD_REQUEST]: {
                    description: "Invalid input data",
                },
                [HttpStatusEnum.UNAUTHORIZED]: { description: "Unauthorized" },
            },
        },
    },
};
