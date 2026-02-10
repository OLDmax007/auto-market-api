import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { listingRepository } from "../repositories/listing.repository";
import {
    ListingCreateDbType,
    ListingCreateDtoType,
    ListingModerationResultType,
    ListingType,
    ListingUpdateAdminDtoType,
    ListingUpdateManagerDtoType,
    ListingUpdateUserDtoType,
} from "../types/listing.type";
import { CurrencyAmountType } from "../types/rate.type";
import { TokenPayloadType } from "../types/token.type";
import { carService } from "./car.service";
import { listingStaticService } from "./listing-static.service";
import { locationService } from "./location.service";
import { moderationService } from "./moderation/moderation.service";
import { platformRoleService } from "./platform-role.service";
import { pricingService } from "./pricing.service";
import { profanityService } from "./profanity.service";
import { userService } from "./user.service";

class ListingService {
    public getAll(): Promise<ListingType[]> {
        return listingRepository.getAll();
    }

    public async getById(id: string): Promise<ListingType> {
        const listing = await listingRepository.getById(id);
        if (!listing) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Listing not found");
        }

        await listingStaticService.incrementViewsByListingId(listing._id);

        return listing;
    }

    public async create(
        userId: string,
        { enteredPrice: { amount, currency }, ...newDto }: ListingCreateDtoType,
    ): Promise<{
        listing: ListingType;
        moderation: ListingModerationResultType;
    }> {
        await locationService.validateCityInRegion(newDto.region, newDto.city);
        await carService.validateCarModel(newDto.make, newDto.model);

        const { organizationId } = await userService.getById(userId);

        const prices = await pricingService.calculateListingPrices(
            amount,
            currency,
        );

        if (!prices.length) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "PRICING_CALCULATION_FAILED",
            );
        }

        const moderation = await this.checkListingForProfanity(
            newDto.title,
            newDto.description,
            -1,
        );

        const listing = await listingRepository.create({
            userId,
            organizationId,
            prices,
            publishedAt: new Date(),
            isActive: moderation.isActive,
            profanityCheckAttempts: moderation.profanityCheckAttempts,
            ...newDto,
        });

        if (
            moderation.isProfanity &&
            moderation.profanityCheckAttempts >= moderation.maxAttempts
        ) {
            await moderationService.sendListWithInactiveListingToModeration(
                {
                    title: listing.title,
                    _id: listing._id,
                    userId: listing.userId,
                },
                moderation,
            );
        }
        await listingStaticService.createViews({
            listingId: listing._id,
            views: {
                all: 0,
                day: 0,
                month: 0,
                week: 0,
            },
        });

        return {
            listing,
            moderation,
        };
    }

    public async getCalculatedPrices(
        enteredPrice: CurrencyAmountType,
    ): Promise<CurrencyAmountType[]> {
        return pricingService.calculateListingPrices(
            enteredPrice.amount,
            enteredPrice.currency,
        );
    }

    async updateById(
        id: string,
        payload: TokenPayloadType,
        dto:
            | ListingUpdateUserDtoType
            | ListingUpdateManagerDtoType
            | ListingUpdateAdminDtoType,
    ): Promise<ListingType> {
        const listing = await this.getById(id);

        if (dto.region || dto.city) {
            await locationService.validateCityInRegion(
                dto.region ?? listing.region,
                dto.city ?? listing.city,
            );
        }
        if (dto.make || dto.model) {
            await carService.validateCarModel(
                dto.make ?? listing.make,
                dto.model ?? listing.model,
            );
        }

        const { role } = await platformRoleService.getPlatformRoleById(
            payload.platformRoleId,
        );

        if (role === PlatformRoleEnum.VISITOR) {
            if (listing.userId !== payload.userId) {
                throw new ApiError(
                    HttpStatusEnum.FORBIDDEN,
                    "Access denied: You are not the owner of this listing",
                );
            }
        }

        if (role === PlatformRoleEnum.VISITOR) {
            if (
                "isActive" in dto ||
                "publishedAt" in dto ||
                "profanityCheckAttempts" in dto
            ) {
                throw new ApiError(
                    HttpStatusEnum.BAD_REQUEST,
                    "Forbidden fields for user role",
                );
            }
        }

        if (role === PlatformRoleEnum.MANAGER) {
            if ("profanityCheckAttempts" in dto) {
                throw new ApiError(
                    HttpStatusEnum.BAD_REQUEST,
                    "Forbidden fields for manager role",
                );
            }
        }

        let update: Partial<ListingCreateDbType> = { ...dto };

        if (dto.enteredPrice) {
            update.prices = await this.getCalculatedPrices(dto.enteredPrice);
        }

        if (dto.title || dto.description) {
            const mod = await this.checkListingForProfanity(
                dto.title ?? listing.title,
                dto.description ?? listing.description,
                listing.profanityCheckAttempts,
            );

            update.isActive = mod.isActive;
            update.profanityCheckAttempts = mod.profanityCheckAttempts;

            if (
                role === PlatformRoleEnum.VISITOR &&
                mod.isProfanity &&
                mod.profanityCheckAttempts >= mod.maxAttempts
            ) {
                await moderationService.sendListWithInactiveListingToModeration(
                    {
                        title: listing.title,
                        _id: listing._id,
                        userId: listing.userId,
                    },
                    mod,
                );
                throw new ApiError(
                    HttpStatusEnum.FORBIDDEN,
                    "Profanity attempts exceeded",
                );
            }
        }

        if (
            role === PlatformRoleEnum.MANAGER ||
            role === PlatformRoleEnum.ADMIN
        ) {
            let managerOrAdminDto = dto as
                | ListingUpdateManagerDtoType
                | ListingUpdateAdminDtoType;

            if (managerOrAdminDto.isActive !== undefined) {
                update.isActive = managerOrAdminDto.isActive;
                if (managerOrAdminDto.isActive) {
                    update.profanityCheckAttempts = 0;
                }
            }

            if (role === PlatformRoleEnum.ADMIN) {
                const adminDto = dto as ListingUpdateAdminDtoType;
                update = { ...update, ...adminDto };
            }
        }

        return listingRepository.updateById(id, update);
    }

    public async activateListing(id: string): Promise<ListingType> {
        const listing = await this.getById(id);

        if (listing.isActive) {
            return listing;
        }

        return listingRepository.updateById(id, {
            isActive: true,
        });
    }

    public async deactivateListing(id: string): Promise<ListingType> {
        const listing = await this.getById(id);

        if (!listing.isActive) {
            return listing;
        }

        return listingRepository.updateById(id, {
            isActive: false,
        });
    }

    public async deactivateManyByUserId(
        userId: string,
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        await userService.getById(userId);
        return listingRepository.deactivateManyByUserId(userId);
    }

    public async deleteById(id: string): Promise<ListingType> {
        await this.getById(id);
        return listingRepository.deleteById(id);
    }

    public async checkListingForProfanity(
        title: string,
        description: string,
        currentAttempts: number = 0,
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
}

export const listingService = new ListingService();
