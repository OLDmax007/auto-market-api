import { UpdateEntityType } from "../../../common/types/base.type";
import {
    PaginatedResponseType,
    PaginateFilterType,
    PaginateOptionsType,
} from "../../../common/types/pagination.type";
import { Listing } from "../models/listing.model";
import { ListingCreateDbType, ListingType } from "../types/listing.type";

class ListingRepository {
    public async getAllPaginated(
        filter: PaginateFilterType,
        options: PaginateOptionsType,
    ): Promise<PaginatedResponseType<ListingType>> {
        return Listing.paginate({ ...filter, isDeleted: false }, options);
    }

    public async getById(id: string): Promise<ListingType> {
        return Listing.findOne({ _id: id, isDeleted: false });
    }

    public async create(dto: ListingCreateDbType): Promise<ListingType> {
        return Listing.create(dto);
    }

    public async updateById(
        id: string,
        dto: UpdateEntityType<ListingType>,
    ): Promise<ListingType> {
        return Listing.findOneAndUpdate({ _id: id, isDeleted: false }, dto, {
            new: true,
        });
    }

    public async deleteById(id: string): Promise<ListingType> {
        return Listing.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
            { new: true },
        );
    }

    public async deleteAllByUserId(userId: string): Promise<void> {
        await Listing.updateMany(
            { userId, isDeleted: false },
            {
                $set: {
                    isDeleted: true,
                    isActive: false,
                    deletedAt: new Date(),
                },
            },
        );
    }

    public async deactivateManyByUserId(userId: string): Promise<void> {
        await Listing.updateMany(
            { userId, isDeleted: false },
            { $set: { isActive: false } },
        );
    }

    public async activateManyByUserId(userId: string): Promise<void> {
        await Listing.updateMany(
            { userId, isProfanity: false, isDeleted: false },
            { $set: { isActive: true } },
        );
    }

    public countByUserId(userId: string): Promise<number> {
        return Listing.countDocuments({ userId, isDeleted: false });
    }
}

export const listingRepository = new ListingRepository();
