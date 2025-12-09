import { EngineEnum, TransmissionEnum } from "../enums/car.enum";

export type CarListingType = {
    _id: string;
    userId: string;
    organizationId: string;
    category: string;
    title: string;
    description: string;
    make: string;
    model: string;
    year: number;
    mileage_km: number;
    engineType: EngineEnum;
    transmission: TransmissionEnum;
    price_usd: number;
    city: string;
    main_photo_url: string;
    date_posted: Date;
    last_updated: Date;
};
