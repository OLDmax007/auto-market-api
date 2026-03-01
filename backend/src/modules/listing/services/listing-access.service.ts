import { mainConfig } from "../../../common/configs/main.config";
import { EMAIL_DATA } from "../../../common/constants/email-data.constants";
import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { ensureIsActive } from "../../../common/helpers/ensure.helper";
import { buildLink } from "../../../common/helpers/link-builder.helper";
import { emailService } from "../../../common/services/email.service";
import { UpdateEntityType } from "../../../common/types/base.type";
import { SubscriptionPlanEnum } from "../../subscription/enums/subscription-plan.enum";
import { subscriptionService } from "../../subscription/subscription.service";
import { PlatformRoleEnum } from "../../user/enums/platform-role.enum";
import { userService } from "../../user/services/user.service";
import { listingRepository } from "../repositories/listing.repository";
import { ListingCreateDbType, ListingType } from "../types/listing.type";
import { profanityService } from "./profanity.service";

class ListingAccessService {
    private readonly maxAttempts = 3;

    public checkListingOwnership(ownerId: string, initiatorId: string): void {
        if (String(ownerId) !== String(initiatorId)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "You are not the owner of this listing",
            );
        }
    }

    public async handleProfanity(
        listing: ListingType,
        role: PlatformRoleEnum,
        dto: { title?: string; description?: string },
    ): Promise<{
        updateProfanity: Partial<ListingCreateDbType>;
        error: ApiError | null;
    }> {
        const isStaff = [
            PlatformRoleEnum.ADMIN,
            PlatformRoleEnum.MANAGER,
        ].includes(role);

        if (!dto.title && !dto.description)
            return { updateProfanity: {}, error: null };

        const isDirty = profanityService.hasAnyProfanity(
            dto.title ?? listing.title,
            dto.description ?? listing.description,
        );

        if (isStaff && isDirty) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Profanity detected. Please clean up your title or description",
            );
        }

        if (!isStaff) {
            if (listing.profanityCheckAttempts >= this.maxAttempts) {
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
        }

        const updateProfanity: UpdateEntityType<ListingType> = {};

        if (isDirty) {
            const newAttempts = listing.profanityCheckAttempts + 1;
            updateProfanity.isProfanity = true;
            updateProfanity.isActive = false;
            updateProfanity.profanityCheckAttempts = newAttempts;

            if (newAttempts === this.maxAttempts) {
                emailService
                    .sendEmail(
                        mainConfig.EMAIL_SUPPORT,
                        EMAIL_DATA.LISTING_MODERATION,
                        {
                            listingId: listing._id,
                            link: buildLink(
                                `/listings/moderation/${listing._id}`,
                            ),
                        },
                    )
                    .catch();
            }

            const attemptsLeft = this.maxAttempts - newAttempts;
            return {
                updateProfanity,
                error: new ApiError(
                    HttpStatusEnum.BAD_REQUEST,
                    attemptsLeft > 0
                        ? `Profanity! Attempts left: ${attemptsLeft} / ${this.maxAttempts}`
                        : "Profanity! No attempts left. Listing deactivated",
                ),
            };
        }

        updateProfanity.isProfanity = false;
        updateProfanity.profanityCheckAttempts = 0;

        if (listing.isProfanity && !isStaff) {
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

        const limit =
            planType === SubscriptionPlanEnum.PREMIUM && isActive
                ? Infinity
                : 1;

        if (currentListingsCount >= limit) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Limit reached. Upgrade to Premium!",
            );
        }
    }

    public checkAccess(
        targetId: string,
        userId: string,
        role: PlatformRoleEnum,
    ): void {
        const isOwner = String(targetId) === String(userId);
        const isStaff = [
            PlatformRoleEnum.ADMIN,
            PlatformRoleEnum.MANAGER,
        ].includes(role);

        if (!isOwner && !isStaff) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "You have no permission for this action",
            );
        }
    }
}

export const listingAccessService = new ListingAccessService();
