import { listingRepository } from "../repositories/listing.repository";
import { ListingType } from "../types/listing.type";

class ListingService {
    public getAll(): Promise<ListingType[]> {
        return listingRepository.getAll();
    }

    public getById(id: string): Promise<ListingType> {
        return listingRepository.getById(id);
    }
}

export const listingService = new ListingService();
