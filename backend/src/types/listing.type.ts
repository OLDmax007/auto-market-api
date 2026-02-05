import { CarMarkEnum, EngineEnum, TransmissionEnum } from "../enums/car.enum";
import { CountryEnum } from "../enums/country-enum";
import { RegionEnum } from "../enums/region-enum";
import { BaseType } from "./base.type";
import { CurrencyAmountType } from "./rate.type";

export type ListingType = {
    _id: string;
    userId: string;
    organizationId: string | null;
    title: string;
    description: string;
    make: CarMarkEnum;
    model: string;
    year: number;
    mileage_km: number;
    engineType: EngineEnum;
    transmission: TransmissionEnum;
    prices: CurrencyAmountType[];
    country: CountryEnum.UKRAINE;
    region: RegionEnum;
    city: string;
    main_photo_url: string;
    isActive: boolean;
    profanityCheckAttempts: number;
    publishedAt: Date | null;
} & BaseType;

export type ListingCreateDtoType = Omit<
    ListingType,
    | "_id"
    | "userId"
    | "organizationId"
    | "createdAt"
    | "updatedAt"
    | "publishedAt"
    | "prices"
    | "isActive"
    | "profanityCheckAttempts"
> & {
    enteredPrice: CurrencyAmountType;
};

export type ListingUpdateUserDtoType = Partial<ListingCreateDtoType> & {
    enteredPrice?: CurrencyAmountType;
};

export type ListingUpdateManagerDtoType = Partial<ListingCreateDtoType> & {
    isActive?: boolean;
    profanityCheckAttempts?: number;
};

export type ListingUpdateAdminDtoType = Partial<ListingType> & {
    enteredPrice?: CurrencyAmountType;
};
export type ListingCreateDbType = Omit<
    ListingType,
    "_id" | "createdAt" | "updatedAt"
>;

export type ListingModerationResultType = {
    isProfanity: boolean;
    isActive: boolean;
    profanityCheckAttempts: number;
    maxAttempts: number;
};
