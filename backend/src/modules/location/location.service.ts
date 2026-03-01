import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { ApiError } from "../../common/errors/api.error";
import { RegionEnum } from "./enums/region.enum";
import { locationRepository } from "./location.repository";
import { LocationMapType } from "./location.type";

class LocationService {
    public async getCitiesByRegion(
        region: RegionEnum,
    ): Promise<LocationMapType> {
        const location = await locationRepository.getCitiesByRegion(region);
        if (!location) {
            throw new ApiError(
                HttpStatusEnum.NOT_FOUND,
                `Region '${region}'not found`,
            );
        }
        return location;
    }

    public async validateCityInRegion(
        region: RegionEnum,
        city: string,
    ): Promise<void> {
        const { cities } = await this.getCitiesByRegion(region);
        if (!cities.includes(city)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                `City '${city}' does not exist in region '${region}'`,
            );
        }
    }
}

export const locationService = new LocationService();
