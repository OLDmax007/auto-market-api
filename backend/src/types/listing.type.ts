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
    poster: string;
    isProfanity: boolean;
    isActive: boolean;
    profanityCheckAttempts: number;
    publishedAt: Date | null;
} & BaseType;

export type ListingCreateDtoType = Pick<
    ListingType,
    | "title"
    | "description"
    | "make"
    | "model"
    | "year"
    | "mileage_km"
    | "engineType"
    | "transmission"
    | "region"
    | "city"
> & {
    enteredPrice: CurrencyAmountType;
};

export type ListingUpdateDtoType = Partial<ListingCreateDtoType>;

export type ListingCreateDbType = Omit<ListingCreateDtoType, "enteredPrice"> &
    Pick<
        ListingType,
        | "userId"
        | "organizationId"
        | "isActive"
        | "isProfanity"
        | "publishedAt"
        | "prices"
    >;
