import { BaseType } from "../../../common/types/base.type";
import { CarMakeEnum } from "../../car/car.enum";
import { CountryEnum } from "../../location/enums/country.enum";
import { RegionEnum } from "../../location/enums/region.enum";
import { CurrencyAmountType } from "../../rate/rate.type";

export type ListingType = {
    _id: string;
    userId: string;
    organizationId: string | null;
    title: string;
    description: string;
    make: CarMakeEnum;
    model: string;
    year: number;
    mileage_km: number;
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
