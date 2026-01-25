import { CarMarkEnum } from "../enums/car.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { carRepository } from "../repositories/car.repository";
import { CarMapType } from "../types/car.type";

class CarService {
    public async getModelsByMake(make: CarMarkEnum): Promise<CarMapType> {
        const car = await carRepository.getByMake(make);
        if (!car) {
            throw new ApiError(
                HttpStatusEnum.NOT_FOUND,
                `Car make - ${make} not found`,
            );
        }
        return car;
    }

    public async getAllMakes(): Promise<string[]> {
        const cars = await carRepository.getAll();
        return cars.map((c) => c.make);
    }
}

export const carService = new CarService();
