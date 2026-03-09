import { mainConfig } from "../../common/configs/main.config";
import { clearName } from "../../common/helpers/clear.name";
import { PlatformRoleEnum } from "../user/enums/platform-role.enum";
import { ListingType } from "./types/listing.type";

type ListingResponseDto = Omit<ListingType, "make"> & { make: string };

export class ListingPresenter {
    private static getPublicFields(
        listing: ListingType,
    ): Partial<ListingResponseDto> {
        return {
            _id: listing._id,
            userId: listing.userId,
            organizationId: listing.organizationId,
            title: listing.title,
            description: listing.description,
            make: clearName(listing.make),
            model: clearName(listing.model),
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
    ): Partial<ListingResponseDto> {
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
    ): Partial<ListingResponseDto> {
        return {
            ...this.getPublicFields(listing),
            isProfanity: listing.isProfanity,
            isActive: listing.isActive,
            createdAt: listing.createdAt,
        };
    }

    public static toPublicResponse(
        listing: ListingType,
    ): Partial<ListingResponseDto> {
        return this.getPublicFields(listing);
    }
}
