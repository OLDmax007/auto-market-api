import { mainConfig } from "../../../common/configs/main.config";
import { EMAIL_DATA } from "../../../common/constants/email-data.constants";
import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { ensureIsActive } from "../../../common/helpers/ensure.helper";
import { buildLink } from "../../../common/helpers/link-builder.helper";
import { emailService } from "../../../common/services/email.service";
import { UpdateEntityType } from "../../../common/types/base.type";
import { CarMakeEnum } from "../../car/car.enum";
import { carService } from "../../car/car.service";
import { RegionEnum } from "../../location/enums/region.enum";
import { locationService } from "../../location/location.service";
import { SUBSCRIPTION_PLANS } from "../../subscription/subscription.constants";
import { subscriptionService } from "../../subscription/subscription.service";
import { userService } from "../../user/services/user.service";
import { listingConfig } from "../listing.config";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingType,
    ListingUpdateDtoType,
} from "../types/listing.type";
import { profanityService } from "./profanity.service";

class ListingAccessService {
    public async handleProfanity(
        listing: ListingType,
        dto: { title?: string; description?: string },
    ): Promise<{
        updateProfanity: Partial<ListingCreateDbType>;
        error: ApiError | null;
    }> {
        const { maxAttempts } = listingConfig;

        if (!dto.title && !dto.description)
            return { updateProfanity: {}, error: null };

        if (listing.profanityCheckAttempts >= maxAttempts) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Listing deactivated due to profanity limit.",
            );
        }
        if (!listing.isActive && !listing.isProfanity) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Listing is deactivated and cannot be edited",
            );
        }

        const isDirty = profanityService.hasAnyProfanity(
            dto.title ?? listing.title,
            dto.description ?? listing.description,
        );

        const updateProfanity: UpdateEntityType<ListingType> = {};

        if (isDirty) {
            const newAttempts = listing.profanityCheckAttempts + 1;
            updateProfanity.isProfanity = true;
            updateProfanity.isActive = false;
            updateProfanity.profanityCheckAttempts = newAttempts;

            if (newAttempts === maxAttempts) {
                emailService
                    .sendEmail(
                        mainConfig.EMAIL_SUPPORT,
                        EMAIL_DATA.LISTING_STAFF,
                        {
                            listingId: listing._id,
                            link: buildLink(`/listings/staff/${listing._id}`),
                        },
                    )
                    .catch();
            }

            const attemptsLeft = maxAttempts - newAttempts;
            return {
                updateProfanity,
                error: new ApiError(
                    HttpStatusEnum.BAD_REQUEST,
                    attemptsLeft > 0
                        ? `Profanity! Attempts left: ${attemptsLeft} / ${maxAttempts}`
                        : "Profanity! No attempts left. Listing deactivated",
                ),
            };
        }

        updateProfanity.isProfanity = false;
        updateProfanity.profanityCheckAttempts = 0;

        if (listing.isProfanity) {
            updateProfanity.isActive = true;
        }

        return { updateProfanity, error: null };
    }

    public async checkUserLimit(userId: string): Promise<void> {
        const user = await userService.getById(userId);
        const currentListingsCount =
            await listingRepository.countByUserId(userId);

        const { planType, isActive } = await subscriptionService.getById(
            user.subscriptionId,
        );

        ensureIsActive(
            isActive,
            "Your subscription is deactivated. Please renew!",
        );

        const { maxListingsLimit } = SUBSCRIPTION_PLANS[planType];

        if (currentListingsCount >= maxListingsLimit) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Limit reached. Upgrade to Premium!",
            );
        }
    }

    public async validateListingData(
        dto: ListingUpdateDtoType,
        listingData: {
            region: RegionEnum;
            city: string;
            make: CarMakeEnum;
            model: string;
        },
    ): Promise<void> {
        if (dto.region || dto.city) {
            await locationService.validateCityInRegion(
                dto.region ?? listingData.region,
                dto.city ?? listingData.city,
            );
        }
        if (dto.make || dto.model) {
            await carService.validateCarModel(
                dto.make ?? listingData.make,
                dto.model ?? listingData.model,
            );
        }
    }
}

export const listingAccessService = new ListingAccessService();
