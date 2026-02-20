import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingModerationResultType,
    ListingType,
} from "../types/listing.type";
import { profanityService } from "./profanity.service";
import { subscriptionService } from "./subscription.service";
import { userService } from "./user.service";

class ListingAccessService {
    public checkListingOwnership(ownerId: string, initiatorId: string): void {
        if (String(ownerId) !== String(initiatorId)) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "You are not the owner of this listing",
            );
        }
    }

    private async checkListingForProfanity(
        title: string,
        description: string,
        currentAttempts: number,
    ): Promise<ListingModerationResultType> {
        const maxAttempts = 3;
        const isProfanity = profanityService.hasAnyProfanity(
            title,
            description,
        );

        let profanityCheckAttempts = currentAttempts;
        let isActive = true;

        if (isProfanity) {
            if (currentAttempts >= 0) {
                profanityCheckAttempts += 1;
            }
            isActive = false;
            if (profanityCheckAttempts >= maxAttempts) {
                isActive = false;
            }
        } else {
            profanityCheckAttempts = 0;
        }

        return {
            isProfanity,
            isActive,
            profanityCheckAttempts,
            maxAttempts,
        };
    }

    public async handleProfanity(
        listing: ListingType,
        role: PlatformRoleEnum,
        {
            title,
            description,
            isActive,
        }: { title?: string; description?: string; isActive?: boolean },
    ): Promise<{
        updateProfanity: Partial<ListingCreateDbType>;
        error: ApiError | null;
    }> {
        const updateProfanity: Partial<ListingCreateDbType> = {};
        if (title || description) {
            const mod = await this.checkListingForProfanity(
                title ?? listing.title,
                description ?? listing.description,
                listing.profanityCheckAttempts,
            );

            updateProfanity.isActive = mod.isActive;
            updateProfanity.profanityCheckAttempts = mod.profanityCheckAttempts;

            if (role === PlatformRoleEnum.SELLER && mod.isProfanity) {
                if (mod.profanityCheckAttempts >= mod.maxAttempts) {
                    return {
                        updateProfanity,
                        error: new ApiError(
                            HttpStatusEnum.FORBIDDEN,
                            "Profanity attempts exceeded. Sent to moderation.",
                        ),
                    };
                } else {
                    return {
                        updateProfanity,
                        error: new ApiError(
                            HttpStatusEnum.BAD_REQUEST,
                            `Profanity detected. Attempts left: ${mod.maxAttempts - mod.profanityCheckAttempts} of ${mod.maxAttempts}`,
                        ),
                    };
                }
            }
        }

        if (
            (role === PlatformRoleEnum.MANAGER ||
                role === PlatformRoleEnum.ADMIN) &&
            isActive
        ) {
            updateProfanity.profanityCheckAttempts = 0;
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
        const limit =
            planType === PlanTypeEnum.PREMIUM && isActive ? Infinity : 1;

        if (currentListingsCount >= limit) {
            throw new ApiError(
                HttpStatusEnum.FORBIDDEN,
                "Limit reached. Upgrade your account!",
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
                "Access denied: You do not have permission to perform this action",
            );
        }
    }
}

export const listingAccessService = new ListingAccessService();
