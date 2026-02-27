import { CarMarkEnum } from "../enums/car.enum";

export type CarMapType = {
    make: CarMarkEnum;
    models: string[];
};

export type CarMissingReportType = {
    make?: string;
    model?: string;
};
