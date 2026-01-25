import { HttpStatusEnum } from "../enums/http-status.enum";
import { RegionEnum } from "../enums/region-enum";
import { ApiError } from "../errors/api.error";
import { locationRepository } from "../repositories/location.repository";
import { LocationMapType } from "../types/location.type";

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
}

export const locationService = new LocationService();
