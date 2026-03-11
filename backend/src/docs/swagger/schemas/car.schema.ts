import { OpenAPIV3 } from "openapi-types";

export const carSchema: Record<string, OpenAPIV3.SchemaObject> = {
    CarMakesResponse: {
        type: "object",
        properties: {
            makes: {
                type: "array",
                items: { type: "string", example: "BMW" },
            },
        },
    },
    CarModelsResponse: {
        type: "object",
        properties: {
            models: {
                type: "array",
                items: { type: "string", example: "M5" },
            },
        },
    },
    MissingMakeDto: {
        type: "object",
        required: ["make"],
        properties: {
            make: { type: "string", example: "Tesla" },
        },
    },
    MissingModelDto: {
        type: "object",
        required: ["make", "model"],
        properties: {
            make: { type: "string", example: "BMW" },
            model: { type: "string", example: "M4" },
        },
    },
};
