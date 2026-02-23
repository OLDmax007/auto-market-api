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

    private checkListingForProfanity(
        { title, description }: { title: string; description: string },
        currentAttempts: number,
        maxAttempts: number,
    ): ListingModerationResultType {
        const isProfanity = profanityService.hasAnyProfanity(
            title,
            description,
        );

        let profanityCheckAttempts = currentAttempts;

        if (isProfanity) {
            if (currentAttempts < maxAttempts) {
                profanityCheckAttempts += 1;
            }
        } else {
            profanityCheckAttempts = 0;
        }

        return {
            isProfanity,
            profanityCheckAttempts,
            maxAttempts,
        };
    }

    public async handleProfanity(
        listing: ListingType,
        role: PlatformRoleEnum,
        dto: { title?: string; description?: string },
    ): Promise<{
        updateProfanity: Partial<ListingCreateDbType>;
        error: ApiError | null;
    }> {
        const isStaff =
            role === PlatformRoleEnum.ADMIN ||
            role === PlatformRoleEnum.MANAGER;

        if (isStaff) {
            profanityService.checkProfanity(dto.title, dto.description);
        }

        const maxAttempts = 3;

        if (!listing.isActive && !isStaff) {
            if (listing.profanityCheckAttempts >= maxAttempts) {
                return {
                    updateProfanity: {},
                    error: new ApiError(
                        HttpStatusEnum.FORBIDDEN,
                        "Listing deactivated due to profanity limit",
                    ),
                };
            }
            if (listing.profanityCheckAttempts === 0) {
                return {
                    updateProfanity: {},
                    error: new ApiError(
                        HttpStatusEnum.NOT_FOUND,
                        "Listing is deactivated",
                    ),
                };
            }
        }

        const updateProfanity: Partial<ListingCreateDbType> = {};

        if (dto.title || dto.description) {
            const mod = this.checkListingForProfanity(
                {
                    title: dto.title ?? listing.title,
                    description: dto.description ?? listing.description,
                },
                listing.profanityCheckAttempts,
                maxAttempts,
            );

            if (mod.isProfanity) {
                updateProfanity.isActive = false;
                updateProfanity.profanityCheckAttempts =
                    mod.profanityCheckAttempts;
                const attemptsLeft = maxAttempts - mod.profanityCheckAttempts;
                return {
                    updateProfanity,
                    error: new ApiError(
                        HttpStatusEnum.BAD_REQUEST,
                        attemptsLeft > 0
                            ? `Profanity! Attempts left: ${attemptsLeft} / ${maxAttempts}`
                            : "Profanity! No attempts left. Listing deactivated",
                    ),
                };
            } else {
                updateProfanity.profanityCheckAttempts =
                    mod.profanityCheckAttempts;
                if (listing.profanityCheckAttempts > 0) {
                    updateProfanity.isActive = true;
                }
            }
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
                " You do not have permission to perform this action",
            );
        }
    }
}

export const listingAccessService = new ListingAccessService();
