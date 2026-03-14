import { RegionEnum } from "./enums/region.enum";
import { Location } from "./location.model";
import { LocationMapType } from "./location.type";

class LocationRepository {
    public async getCitiesByRegion(
        region: RegionEnum,
    ): Promise<LocationMapType> {
        return Location.findOne({ region });
    }
}

export const locationRepository = new LocationRepository();
