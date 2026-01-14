import {
    BmwModelsEnum,
    CarMarkEnum,
    DaewooModelsEnum,
} from "../enums/car.enum";

export const CarMap: Record<CarMarkEnum, string[]> = {
    [CarMarkEnum.BMW]: Object.values(BmwModelsEnum),
    [CarMarkEnum.Daewoo]: Object.values(DaewooModelsEnum),
};
