import { RegionEnum } from "../enums/region-enum";
import { Location } from "../models/location.model";
import { LocationMapType } from "../types/location.type";

class LocationRepository {
    public async getCitiesByRegion(
        region: RegionEnum,
    ): Promise<LocationMapType> {
        return Location.findOne({ region });
    }
}

export const locationRepository = new LocationRepository();
