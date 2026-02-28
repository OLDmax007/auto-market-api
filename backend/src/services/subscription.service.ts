import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PaymentStatusEnum } from "../enums/payment-status.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { SubscriptionPlanEnum } from "../enums/subscription-plan.enum";
import { ApiError } from "../errors/api.error";
import { ensureIsStatusSame } from "../helpers/ensure.helper";
import { paymentRepository } from "../repositories/payment.repository";
import { subscriptionRepository } from "../repositories/subscription.repository";
import { userRepository } from "../repositories/user.repository";
import {
    SubscriptionCreateType,
    SubscriptionType,
} from "../types/billing/subcription.type";
import { platformRoleService } from "./platform-role.service";
import { userService } from "./user.service";
import { userAccessService } from "./user-access.service";

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
        const price = { amount: 500, currency: CurrencyEnum.UAH };

        if (balance.amount < price.amount) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User does not has enough money",
            );
        }

        await paymentRepository.create({
            subscriptionId,
            userId,
            price: {
                amount: price.amount,
                currency: CurrencyEnum.UAH,
            },
            paidAt: new Date(),
            status: PaymentStatusEnum.SUCCESS,
        });

        await userRepository.updateById(userId, {
            balance: {
                amount: balance.amount - price.amount,
                currency: CurrencyEnum.UAH,
            },
        });

        return subscriptionRepository.updateById(subscriptionId, {
            price,
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
