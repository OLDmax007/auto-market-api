import { OpenAPIV3 } from "openapi-types";

import { CarMakeEnum } from "../../../modules/car/car.enum";
import { CountryEnum } from "../../../modules/location/enums/country.enum";
import { RegionEnum } from "../../../modules/location/enums/region.enum";
import { basePaginationParams } from "./common.schema";

export const listingSchema: Record<string, OpenAPIV3.SchemaObject> = {
    Listing: {
        type: "object",
        properties: {
            _id: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0e1" },
            userId: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0d1" },
            organizationId: { type: "string", nullable: true, example: null },
            title: { type: "string", example: "BMW X5 in perfect condition" },
            description: {
                type: "string",
                example: "something something something something",
            },
            make: {
                type: "string",
                enum: Object.values(CarMakeEnum),
                example: CarMakeEnum.BMW,
            },
            model: { type: "string", example: "X5" },
            year: { type: "integer", example: 2022 },
            mileage_km: { type: "integer", example: 45000 },
            prices: {
                type: "array",
                items: { $ref: "#/components/schemas/CurrencyAmount" },
            },
            country: {
                type: "string",
                enum: [CountryEnum.UKRAINE],
                default: CountryEnum.UKRAINE,
            },
            city: { type: "string", example: "Київ" },
            region: {
                type: "string",
                enum: Object.values(RegionEnum),
                example: RegionEnum.KYIV,
            },
            poster: {
                type: "string",
                example:
                    "https://auto-market.s3.eu-central-1.amazonaws.com/default/poster.png",
            },
            isProfanity: { type: "boolean", example: false },
            isActive: { type: "boolean", example: true },
            publishedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },

    ListingCreateDto: {
        type: "object",
        required: [
            "title",
            "description",
            "make",
            "model",
            "year",
            "mileage_km",
            "region",
            "city",
            "enteredPrice",
        ],
        properties: {
            title: { type: "string", example: "BMW X5 in perfect condition" },
            description: {
                type: "string",
                example: "something something something something",
            },
            make: { type: "string", enum: Object.values(CarMakeEnum) },
            model: { type: "string", example: "X5" },
            year: { type: "integer", example: 1970 },
            mileage_km: { type: "integer", example: 200 },
            city: { type: "string", example: "Вінниця" },
            region: {
                type: "string",
                example: RegionEnum.VINNYTSIA,
                enum: Object.values(RegionEnum),
            },
            enteredPrice: { $ref: "#/components/schemas/CurrencyAmount" },
        },
    },

    ListingUpdateDto: {
        type: "object",
        description: "Partial update for listing",
        properties: {
            title: { type: "string", example: "BMW X5 in perfect condition" },
            description: {
                type: "string",
                example: "something something something something",
            },
            make: { type: "string", enum: Object.values(CarMakeEnum) },
            model: { type: "string", example: "X5" },
            year: { type: "integer", example: 1970 },
            mileage_km: { type: "integer", example: 200 },
            city: { type: "string", example: "Вінниця" },
            region: {
                type: "string",
                example: RegionEnum.VINNYTSIA,
                enum: Object.values(RegionEnum),
            },
            enteredPrice: { $ref: "#/components/schemas/CurrencyAmount" },
        },
    },

    ListingAdminUpdateDto: {
        type: "object",
        properties: {
            title: { type: "string", example: "BMW X5 in perfect condition" },
            description: {
                type: "string",
                example: "something something something something",
            },
            make: { type: "string", enum: Object.values(CarMakeEnum) },
            model: { type: "string", example: "X5" },
            year: { type: "integer", example: 1970 },
            mileage_km: { type: "integer", example: 200 },
            city: { type: "string", example: "Вінниця" },
            region: {
                type: "string",
                example: RegionEnum.VINNYTSIA,
                enum: Object.values(RegionEnum),
            },
            enteredPrice: { $ref: "#/components/schemas/CurrencyAmount" },
            isProfanity: { type: "boolean", default: false },
        },
    },

    ListingManagerUpdateDto: {
        type: "object",
        required: ["title", "description"],
        properties: {
            title: { type: "string", example: "Update title" },
            description: { type: "string", example: "Update description" },
        },
    },

    ListingViews: {
        type: "object",
        properties: {
            all: { type: "integer", example: 1250 },
            day: { type: "integer", example: 15 },
            week: { type: "integer", example: 80 },
            month: { type: "integer", example: 300 },
        },
    },

    AveragePriceDetail: {
        type: "object",
        properties: {
            averagePrice: { type: "number", example: 18500 },
            listingCount: { type: "integer", example: 42 },
        },
    },

    ListingAveragePriceByLocation: {
        type: "object",
        properties: {
            city: { $ref: "#/components/schemas/AveragePriceDetail" },
            region: { $ref: "#/components/schemas/AveragePriceDetail" },
            country: { $ref: "#/components/schemas/AveragePriceDetail" },
        },
    },

    ListingPremiumStatsResponse: {
        type: "object",
        properties: {
            views: { $ref: "#/components/schemas/ListingViews" },
            averagePrice: {
                $ref: "#/components/schemas/ListingAveragePriceByLocation",
            },
        },
    },

    PaginatedListingResponse: {
        allOf: [
            { $ref: "#/components/schemas/PaginationMeta" },
            {
                type: "object",
                properties: {
                    docs: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Listing" },
                    },
                },
            },
        ],
    },
};

export const listingQueryPublicParams: OpenAPIV3.ParameterObject[] = [
    ...basePaginationParams,
    {
        name: "minPrice",
        in: "query",
        schema: { type: "number" },
        description: "Filter by minimum price",
    },
    {
        name: "maxPrice",
        in: "query",
        schema: { type: "number" },
        description: "Filter by maximum price",
    },
    {
        name: "currency",
        in: "query",
        schema: { type: "string", default: "UAH" },
        description: "Currency for price filter (USD, EUR, UAH)",
    },
];

export const listingQueryMyParams: OpenAPIV3.ParameterObject[] = [
    ...basePaginationParams,
    { name: "minPrice", in: "query", schema: { type: "number" } },
    { name: "maxPrice", in: "query", schema: { type: "number" } },
    { name: "isActive", in: "query", schema: { type: "boolean" } },
];

export const listingQueryStaffParams: OpenAPIV3.ParameterObject[] = [
    ...basePaginationParams,
    { name: "minPrice", in: "query", schema: { type: "number" } },
    { name: "maxPrice", in: "query", schema: { type: "number" } },
    { name: "currency", in: "query", schema: { type: "string" } },
    { name: "userId", in: "query", schema: { type: "string" } },
    { name: "isActive", in: "query", schema: { type: "boolean" } },
    { name: "isProfanity", in: "query", schema: { type: "boolean" } },
];
