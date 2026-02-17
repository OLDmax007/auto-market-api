import { emailConstants } from "../../constants/email-data";
import { PlatformRoleEnum } from "../../enums/platform-role.enum";
import { userRepository } from "../../repositories/user.repository";
import {
    ListingModerationResultType,
    ListingType,
} from "../../types/listing.type";
import { emailService } from "../email.service";
import { platformRoleService } from "../platform-role.service";

class ModerationService {
    public async sendListWithInactiveListingToModeration(
        listing: Pick<ListingType, "_id" | "userId" | "title">,
        moderation: ListingModerationResultType,
    ): Promise<void> {
        const { _id: managerRoleId } =
            await platformRoleService.getPlatformRole(PlatformRoleEnum.MANAGER);

        const managers =
            await userRepository.getManyByPlatformId(managerRoleId);

        if (managers.length >= 1) {
            await Promise.allSettled(
                managers.map((m) => {
                    emailService.sendEmail(
                        m.email,
                        emailConstants.LISTING_CHECK,
                        {
                            listing,
                            moderation,
                            managerName: `${m.firstName} ${m.lastName}`,
                        },
                    );
                }),
            );
        }
    }
}

export const moderationService = new ModerationService();
