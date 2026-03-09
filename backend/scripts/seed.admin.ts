import {mainConfig} from "../src/common/configs/main.config";
import {CurrencyEnum} from "../src/common/enums/currency.enum";
import {SubscriptionPlanEnum} from "../src/modules/subscription/enums/subscription-plan.enum";
import {subscriptionRepository} from "../src/modules/subscription/repositories/subscription.repository";
import {PlatformRoleEnum} from "../src/modules/user/enums/platform-role.enum";
import {User} from "../src/modules/user/models/user.model";
import {userRepository} from "../src/modules/user/repositories/user.repository";
import {passwordService} from "../src/modules/user/services/password.service";
import {platformRoleService} from "../src/modules/user/services/platform-role.service";
import {UserType} from "../src/modules/user/types/user.type";
import {userAccessService} from "../src/modules/user/services/user-access.service";
import {subscriptionService} from "../src/modules/subscription/subscription.service";

const seedAdmin = async () => {
    try {
        const {
            SEED_ADMIN_EMAIL,
            SEED_ADMIN_PASSWORD,
            SEED_ADMIN_FIRSTNAME,
            SEED_ADMIN_LASTNAME,
            SEED_ADMIN_AGE
        } = mainConfig;

        await userAccessService.checkEmailUniqueness(SEED_ADMIN_EMAIL, `Admin "${SEED_ADMIN_FIRSTNAME} ${SEED_ADMIN_LASTNAME}" already exists`);
        const platformRole = await platformRoleService.getPlatformRole(PlatformRoleEnum.ADMIN);
        const hashedPassword = await passwordService.hashPassword(SEED_ADMIN_PASSWORD);

        const admin = await User.create({
            firstName: SEED_ADMIN_FIRSTNAME,
            lastName: SEED_ADMIN_LASTNAME,
            age: SEED_ADMIN_AGE,
            email: SEED_ADMIN_EMAIL,
            password: hashedPassword,
            platformRoleId: platformRole._id.toString(),
            organizationId: null,
            subscriptionId: null,
            balance: { amount: 100000, currency: CurrencyEnum.UAH },
            isVerified: true,
            isActive: true
        } as any) as unknown as UserType;

        const adminId = admin._id.toString();

        const subscription = await subscriptionService.create({
            userId: adminId
        });

        await subscriptionRepository.updateById(subscription._id.toString(), {
            planType: SubscriptionPlanEnum.PREMIUM,
            isActive: true,
            activeFrom: new Date(),
        });

        await userRepository.updateById(adminId, {
            subscriptionId: subscription._id.toString()
        });

        console.log(`Super Admin "${SEED_ADMIN_FIRSTNAME} ${SEED_ADMIN_LASTNAME}" seeded successfully`);

    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

export { seedAdmin };