import { emailConstants } from "../../constants/email-data";
import { PlatformRoleEnum } from "../../enums/platform-role.enum";
import {
    ListingModerationResultType,
    ListingType,
} from "../../types/listing.type";
import { emailService } from "../email.service";
import { platformRoleService } from "../platform-role.service";
import { userService } from "../user.service";

class ModerationService {
    public async sendListWithInactiveListingToModeration(
        listing: Pick<ListingType, "_id" | "userId" | "title">,
        moderation: ListingModerationResultType,
    ): Promise<void> {
        const { _id } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.MANAGER,
        );

        const managers = await userService.getManyByPlatformId(_id);

        await Promise.allSettled(
            managers.map((m) => {
                emailService.sendEmail(m.email, emailConstants.LISTING_CHECK, {
                    listing,
                    moderation,
                    managerName: `${m.firstName} ${m.lastName}`,
                });
            }),
        );
    }
}

export const moderationService = new ModerationService();
