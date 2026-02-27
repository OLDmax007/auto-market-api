import { mainConfig } from "../configs/main.config";
import { emailConstants } from "../constants/email-data";
import { CarMarkEnum } from "../enums/car.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { carRepository } from "../repositories/car.repository";
import { CarMapType, CarMissingReportType } from "../types/car.type";
import { emailService } from "./email.service";

class CarService {
    public async getModelsByMake(make: CarMarkEnum): Promise<CarMapType> {
        const cars = await carRepository.getByMake(make);

        if (!cars) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Car make '${make}' not found`,
            );
        }
        return { make, models: cars.models };
    }

    public async getAllMakes(): Promise<{ makes: CarMarkEnum[] }> {
        const cars = await carRepository.getAll();
        const makes = cars.map((c) => c.make);
        if (!makes.length) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Makes not found");
        }
        return { makes };
    }

    public async validateCarModel(
        make: CarMarkEnum,
        model: string,
    ): Promise<void> {
        const { models } = await this.getModelsByMake(make);
        if (!models.includes(model)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Model '${model}' does not exist for make '${make}'`,
            );
        }
    }

    public async sendMissingCarData(dto: CarMissingReportType): Promise<void> {
        if (!dto.make && !dto.model) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Provide at least make or model",
            );
        }

        emailService
            .sendEmail(mainConfig.EMAIL_SUPPORT, emailConstants.CAR_MISSING, {
                make: dto.make ?? "N/A",
                model: dto.model ?? "N/A",
            })
            .catch();
    }
}

export const carService = new CarService();
