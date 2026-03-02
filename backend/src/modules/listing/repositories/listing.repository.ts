import { UpdateEntityType } from "../../../common/types/base.type";
import {
    PaginatedResponseType,
    PaginateFilterType,
    PaginateOptionsType,
} from "../../../common/types/pagination.type";
import { Listing } from "../models/listing.model";
import { ListingCreateDbType, ListingType } from "../types/listing.type";

class ListingRepository {
    public getAllPaginated(
        filter: PaginateFilterType,
        options: PaginateOptionsType,
    ): Promise<PaginatedResponseType<ListingType>> {
        return Listing.paginate(filter, options);
    }

    public getById(id: string): Promise<ListingType> {
        return Listing.findById(id);
    }

    public create(dto: ListingCreateDbType): Promise<ListingType> {
        return Listing.create(dto);
    }

    public updateById(
        id: string,
        dto: UpdateEntityType<ListingType>,
    ): Promise<ListingType> {
        return Listing.findByIdAndUpdate(id, dto, { new: true });
    }

    public deleteById(id: string): Promise<ListingType> {
        return Listing.findByIdAndDelete(id);
    }
    public async deleteAllByUserId(userId: string) {
        return Listing.deleteMany({ userId });
    }

    public async deactivateManyByUserId(userId: string) {
        return Listing.updateMany({ userId }, { $set: { isActive: false } });
    }

    public async activateManyByUserId(userId: string) {
        return Listing.updateMany(
            { userId, isProfanity: false },
            { $set: { isActive: true } },
        );
    }

    public async countByUserId(userId: string): Promise<number> {
        return Listing.countDocuments({ userId });
    }
}

export const listingRepository = new ListingRepository();
