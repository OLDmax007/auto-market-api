import { CarMakeEnum } from "./car.enum";

export const CarMap: Record<CarMakeEnum, string[]> = {
    [CarMakeEnum.BMW]: ["x5"],
    [CarMakeEnum.DAEWOO]: ["lanos"],
};
