import { CarMakeEnum } from "./car.enum";
import { Car } from "./car.model";
import { CarMapType } from "./car.type";

class CarRepository {
    public async getAll(): Promise<CarMapType[]> {
        return Car.find();
    }

    public async getByMake(make: CarMakeEnum): Promise<CarMapType> {
        return Car.findOne({ make });
    }
}

export const carRepository = new CarRepository();
