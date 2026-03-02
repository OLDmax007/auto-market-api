import { mainConfig } from "../../common/configs/main.config";
import { PlatformRoleEnum } from "../user/enums/platform-role.enum";
import { ListingType } from "./types/listing.type";

export class ListingPresenter {
    private static getPublicFields(listing: ListingType): Partial<ListingType> {
        return {
            _id: listing._id,
            userId: listing.userId,
            organizationId: listing.organizationId,
            title: listing.title,
            description: listing.description,
            make: listing.make,
            model: listing.model,
            year: listing.year,
            mileage_km: listing.mileage_km,
            prices: listing.prices,
            country: listing.country,
            region: listing.region,
            city: listing.city,
            poster: `${mainConfig.AWS_S3_BUCKET_URL}/${listing.poster}`,
            publishedAt: listing.publishedAt,
        };
    }

    public static toResponseByRole(
        listing: ListingType,
        role: PlatformRoleEnum,
    ): Partial<ListingType> {
        const publicFields = this.getPublicFields(listing);

        switch (role) {
            case PlatformRoleEnum.ADMIN:
            case PlatformRoleEnum.MANAGER:
                return {
                    ...publicFields,
                    isActive: listing.isActive,
                    isProfanity: listing.isProfanity,
                    profanityCheckAttempts: listing.profanityCheckAttempts,
                    createdAt: listing.createdAt,
                    updatedAt: listing.updatedAt,
                };

            default:
                return publicFields;
        }
    }

    public static toPrivateResponse(
        listing: ListingType,
    ): Partial<ListingType> {
        return {
            ...this.getPublicFields(listing),
            isProfanity: listing.isProfanity,
            isActive: listing.isActive,
            createdAt: listing.createdAt,
        };
    }

    public static toPublicResponse(listing: ListingType): Partial<ListingType> {
        return this.getPublicFields(listing);
    }
}
