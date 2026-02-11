import { Listing } from "../models/listing/listing.model";
import { ListingCreateDbType, ListingType } from "../types/listing.type";

class ListingRepository {
    public getAll(): Promise<ListingType[]> {
        return Listing.find();
    }

    public getById(id: string): Promise<ListingType> {
        return Listing.findById(id);
    }

    public create(dto: ListingCreateDbType): Promise<ListingType> {
        return Listing.create(dto);
    }

    public updateById(
        id: string,
        dto: Partial<ListingCreateDbType>,
    ): Promise<ListingType> {
        return Listing.findByIdAndUpdate(id, dto, { new: true });
    }

    public deleteById(id: string): Promise<ListingType> {
        return Listing.findByIdAndDelete(id);
    }

    public async deactivateManyByUserId(
        userId: string,
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        return Listing.updateMany({ userId }, { isActive: false });
    }

    public async countByUserId(userId: string): Promise<number> {
        return Listing.countDocuments({ userId });
    }
}

export const listingRepository = new ListingRepository();
