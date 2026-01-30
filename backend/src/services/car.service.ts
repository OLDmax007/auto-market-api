import { CarMarkEnum } from "../enums/car.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { carRepository } from "../repositories/car.repository";
import { CarMapType } from "../types/car.type";

class CarService {
    public async getModelsByMake(make: CarMarkEnum): Promise<CarMapType> {
        const { models } = await carRepository.getByMake(make);
        if (!models.length) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, `"Models not found`);
        }
        return { make, models };
    }

    public async getAllMakes(): Promise<{ makes: CarMarkEnum[] }> {
        const cars = await carRepository.getAll();
        const makes = cars.map((c) => c.make);
        if (!makes.length) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Makes not found");
        }
        return { makes };
    }
}

export const carService = new CarService();
