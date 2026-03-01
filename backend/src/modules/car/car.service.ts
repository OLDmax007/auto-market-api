import { mainConfig } from "../../common/configs/main.config";
import { EMAIL_DATA } from "../../common/constants/email-data.constants";
import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { ApiError } from "../../common/errors/api.error";
import { emailService } from "../../common/services/email.service";
import { CarMarkEnum } from "./car.enum";
import { carRepository } from "./car.repository";
import { CarMapType } from "./car.type";

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

    public async sendMissingModel(dto: { model: string }): Promise<void> {
        if (!dto.model) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Provide at least make or model",
            );
        }
        emailService
            .sendEmail(mainConfig.EMAIL_SUPPORT, EMAIL_DATA.CAR_MODEL_MISSING, {
                model: dto.model,
            })
            .catch();
    }
}

export const carService = new CarService();
