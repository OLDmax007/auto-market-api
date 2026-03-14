import { OpenAPIV3 } from "openapi-types";

export const commonSchema: Record<string, OpenAPIV3.SchemaObject> = {
    Tokens: {
        type: "object",
        required: ["accessToken", "refreshToken"],
        properties: {
            accessToken: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            refreshToken: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
        },
    },
    CurrencyAmount: {
        type: "object",
        required: ["amount", "currency"],
        properties: {
            amount: { type: "number", example: 100 },
            currency: { type: "string", example: "USD" },
        },
    },

    PaginationMeta: {
        type: "object",
        required: [
            "totalDocs",
            "limit",
            "totalPages",
            "page",
            "pagingCounter",
            "hasPrevPage",
            "hasNextPage",
        ],
        properties: {
            totalDocs: { type: "integer", example: 100 },
            limit: { type: "integer", example: 10 },
            totalPages: { type: "integer", example: 10 },
            page: { type: "integer", example: 1 },
            pagingCounter: { type: "integer", example: 1 },
            hasPrevPage: { type: "boolean", example: false },
            hasNextPage: { type: "boolean", example: true },
            prevPage: { type: "integer", nullable: true, example: null },
            nextPage: { type: "integer", nullable: true, example: 2 },
        },
    },
};

export const basePaginationParams: OpenAPIV3.ParameterObject[] = [
    {
        name: "page",
        in: "query",
        schema: { type: "integer", minimum: 1, default: 1 },
        description: "The page number to retrieve",
    },
    {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
        description: "Number of items per page",
    },
    {
        name: "search",
        in: "query",
        schema: { type: "string" },
        description: "Search keyword for filtering results",
    },
    {
        name: "sortedBy",
        in: "query",
        schema: { type: "string", default: "createdAt" },
        description: "Field name by which to sort the results",
    },
    {
        name: "orderBy",
        in: "query",
        schema: {
            type: "string",
            enum: ["asc", "desc"],
            default: "desc",
        },
        description: "Sorting direction: ascending (asc) or descending (desc)",
    },
];
