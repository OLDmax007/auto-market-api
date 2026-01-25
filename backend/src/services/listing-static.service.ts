import { HttpStatusEnum } from "../enums/http-status.enum";
import { PeriodEnum } from "../enums/period.enum";
import { ApiError } from "../errors/api.error";
import { listingStaticRepository } from "../repositories/listing-static.repository";
import { ListingStaticsCreateDtoType } from "../types/listing-statics.type";

class ListingStaticsService {
    public async getViewsByListingId(listingId: string) {
        const stats =
            await listingStaticRepository.getViewsByListingId(listingId);
        if (!stats) {
            throw new ApiError(
                HttpStatusEnum.NOT_FOUND,
                "Listing statistic not found",
            );
        }
        return stats;
    }

    public async createViews(dto: ListingStaticsCreateDtoType) {
        const listing = await this.getViewsByListingId(dto.listingId);
        if (listing) return listing;

        return listingStaticRepository.createViews(dto);
    }

    public async incrementViewsByListingId(listingId: string) {
        await this.getViewsByListingId(listingId);
        await listingStaticRepository.incrementViewsByListingId(listingId);
    }

    public async resetViews(period: PeriodEnum) {
        if (!period) {
            throw new ApiError(HttpStatusEnum.BAD_REQUEST, "Period not found");
        }
        await listingStaticRepository.resetViews(period);
    }
}

export const listingStaticService = new ListingStaticsService();
