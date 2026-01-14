import {
    BmwModelsEnum,
    CarCategoryEnum,
    CarMarkEnum,
    DaewooModelsEnum,
    EngineEnum,
    TransmissionEnum,
} from "../enums/car.enum";
import { BaseType } from "./base.type";
import { CurrencyAmountType } from "./rate.type";

export type ListingType = {
    _id: string;
    userId: string;
    organizationId: string | null;
    category: CarCategoryEnum;
    title: string;
    description: string;
    make: CarMarkEnum;
    model: BmwModelsEnum | DaewooModelsEnum;
    year: number;
    mileage_km: number;
    engineType: EngineEnum;
    transmission: TransmissionEnum;
    prices: CurrencyAmountType[];
    city: string;
    main_photo_url: string;
    isActive: boolean;
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
> & {
    enteredPrice: CurrencyAmountType;
};

export type ListingCreateDbType = Omit<
    ListingType,
    "_id" | "createdAt" | "updatedAt"
>;
