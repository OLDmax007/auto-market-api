import { mainConfig } from "../../common/configs/main.config";
import { EMAIL_DATA } from "../../common/constants/email-data.constants";
import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { ApiError } from "../../common/errors/api.error";
import { clearName } from "../../common/helpers/clear.name";
import { emailService } from "../../common/services/email.service";
import { CarMakeEnum } from "./car.enum";
import { carRepository } from "./car.repository";
import { CarMapType } from "./car.type";

class CarService {
    private async getCars(): Promise<CarMapType[]> {
        const cars = await carRepository.getAll();

        if (!cars || cars.length === 0) {
            throw new ApiError(
                HttpStatusEnum.NOT_FOUND,
                "No car data found in the database",
            );
        }

        return cars;
    }

    private async checkIfModelExistsAsModel(
        modelName: string,
    ): Promise<CarMapType | undefined> {
        const cars = await this.getCars();
        return cars.find((car) => car.models.includes(modelName.toLowerCase()));
    }

    public async getModelsByMake(
        make: CarMakeEnum,
    ): Promise<{ models: string[] }> {
        const car = await carRepository.getByMake(make);
        if (!car) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Car make '${clearName(make)}' not found`,
            );
        }

        if (!car.models || car.models.length === 0) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `No models found for make '${clearName(make)}'`,
            );
        }
        return { models: car.models };
    }

    public async getAllMakes(): Promise<{ makes: CarMakeEnum[] }> {
        const cars = await this.getCars();
        const makes = cars.map((c) => c.make);

        return { makes };
    }

    public async validateCarModel(
        make: CarMakeEnum,
        model: string,
    ): Promise<void> {
        const { models } = await this.getModelsByMake(make);
        if (!models.includes(model.toLowerCase())) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Model '${clearName(model)}' does not exist for make '${clearName(make)}'`,
            );
        }
    }

    public async sendMissingMake(
        {
            userId,
            firstName,
            lastName,
        }: { userId: string; firstName: string; lastName: string },
        { make }: { make: string },
    ): Promise<void> {
        const { makes } = await this.getAllMakes();

        if (makes.includes(make as CarMakeEnum)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Car make '${clearName(make)}' already exists`,
            );
        }

        const carWithThisModel = await this.checkIfModelExistsAsModel(make);

        if (carWithThisModel) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `'${clearName(make)}' is actually a model of '${clearName(carWithThisModel.make)}', not a standalone make!`,
            );
        }

        emailService
            .sendEmail(mainConfig.EMAIL_SUPPORT, EMAIL_DATA.CAR_MISSING, {
                make: clearName(make),
                userId,
                firstName,
                lastName,
            })
            .catch();
    }

    public async sendMissingModel(
        {
            userId,
            firstName,
            lastName,
        }: { userId: string; firstName: string; lastName: string },
        { make, model }: { make: CarMakeEnum; model: string },
    ): Promise<void> {
        const { models } = await this.getModelsByMake(make);

        if (models.includes(model.toLowerCase())) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Model '${clearName(model)}' for make '${clearName(make)}' already exists on our site!`,
            );
        }

        const carWithThisModel = await this.checkIfModelExistsAsModel(model);

        if (carWithThisModel) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `Model '${clearName(model)}' already exists as a model for make '${clearName(carWithThisModel.make)}'!`,
            );
        }

        emailService
            .sendEmail(mainConfig.EMAIL_SUPPORT, EMAIL_DATA.CAR_MISSING, {
                model: clearName(model),
                make: clearName(make),
                userId,
                firstName,
                lastName,
            })
            .catch();
    }
}

export const carService = new CarService();
