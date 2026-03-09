import _ from "lodash";

import { CarMakeEnum } from "./car.enum";

export class CarPresenter {
    public static toMakeListResponse(makes: CarMakeEnum[]): string[] {
        return makes.map((make) => _.capitalize(make));
    }

    public static toModelListResponse(models: string[]): string[] {
        return models.map((model) => _.capitalize(model));
    }
}
