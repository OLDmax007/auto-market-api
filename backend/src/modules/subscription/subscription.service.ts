import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { ApiError } from "../../common/errors/api.error";
import { ensureIsStatusSame } from "../../common/helpers/ensure.helper";
import { PlatformRoleEnum } from "../user/enums/platform-role.enum";
import { userRepository } from "../user/repositories/user.repository";
import { platformRoleService } from "../user/services/platform-role.service";
import { userService } from "../user/services/user.service";
import { userAccessService } from "../user/services/user-access.service";
import { PaymentStatusEnum } from "./enums/payment-status.enum";
import { SubscriptionPlanEnum } from "./enums/subscription-plan.enum";
import { paymentRepository } from "./repositories/payment.repository";
import { subscriptionRepository } from "./repositories/subscription.repository";
import { SUBSCRIPTION_PLANS } from "./subscription.constants";
import {
    SubscriptionCreateType,
    SubscriptionType,
} from "./types/subcription.type";

class SubscriptionService {
    public async getById(id: string): Promise<SubscriptionType> {
        const subscription = await subscriptionRepository.getById(id);
        if (!subscription) {
            throw new ApiError(
                HttpStatusEnum.NOT_FOUND,
                "Subscription not found",
            );
        }
        return subscription;
    }

    public async upgradeToPremium(id: string): Promise<SubscriptionType> {
        const {
            _id: userId,
            subscriptionId,
            balance,
        } = await userService.getById(id);

        const { planType } = await this.getById(subscriptionId);

        if (planType === SubscriptionPlanEnum.PREMIUM) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User already has PREMIUM subscription",
            );
        }
        const { price, currency } =
            SUBSCRIPTION_PLANS[SubscriptionPlanEnum.PREMIUM];

        if (balance.amount < price) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User does not has enough money",
            );
        }

        await paymentRepository.create({
            subscriptionId,
            userId,
            price: {
                amount: price,
                currency: currency,
            },
            paidAt: new Date(),
            status: PaymentStatusEnum.SUCCESS,
        });

        await userRepository.updateById(userId, {
            balance: {
                amount: balance.amount - price,
                currency: currency,
            },
        });

        return subscriptionRepository.updateById(subscriptionId, {
            price: {
                amount: price,
                currency,
            },
            activeFrom: new Date(),
            planType: SubscriptionPlanEnum.PREMIUM,
        });
    }

    public async setStatusByUserId(
        userId: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        isActive: boolean,
    ): Promise<SubscriptionType> {
        const user = await userService.getById(userId);

        if (!userAccessService.isSelfAction(userId, initiatorId)) {
            const { role } = await platformRoleService.getPlatformRoleById(
                user.platformRoleId,
            );
            userAccessService.checkIsStaff(role, initiatorRole);
        }
        const subscription = await this.getById(user.subscriptionId);
        ensureIsStatusSame(
            subscription.isActive,
            isActive,
            `Subscription is already ${isActive ? "activated" : "deactivated"}`,
        );

        return subscriptionRepository.updateById(subscription._id, {
            isActive,
        });
    }

    public async setSubscriptionPlanByUserId(
        userId: string,
        initiatorId: string,
        initiatorRole: PlatformRoleEnum,
        dto: { newPlan: SubscriptionPlanEnum },
    ): Promise<SubscriptionType> {
        const user = await userService.getById(userId);
        const subscription = await this.getById(user.subscriptionId);

        if (!userAccessService.isSelfAction(userId, initiatorId)) {
            const { role } = await platformRoleService.getPlatformRoleById(
                user.platformRoleId,
            );
            userAccessService.checkIsStaff(role, initiatorRole);
        }
        return subscriptionRepository.updateById(subscription._id, {
            activeFrom: new Date(),
            activeTo: null,
            planType: dto.newPlan,
        });
    }

    public async create(
        dto: SubscriptionCreateType,
    ): Promise<SubscriptionType> {
        return subscriptionRepository.create(dto);
    }

    public async deleteById(id: string): Promise<SubscriptionType> {
        const sub = await this.getById(id);
        return subscriptionRepository.deleteById(sub._id);
    }
}

export const subscriptionService = new SubscriptionService();
