import { CarMarkEnum } from "../enums/car.enum";
import { Car } from "../models/car.model";
import { CarMapType } from "../types/car.type";

class CarRepository {
    public async getAll(): Promise<CarMapType[]> {
        return Car.find();
    }

    public async getByMake(make: CarMarkEnum): Promise<CarMapType> {
        return Car.findOne({ make });
    }
}

export const carRepository = new CarRepository();
