import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PaymentStatusEnum } from "../enums/payment-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { ApiError } from "../errors/api.error";
import { paymentRepository } from "../repositories/payment.repository";
import { subscriptionRepository } from "../repositories/subscription.repository";
import { userRepository } from "../repositories/user.repository";
import {
    SubscriptionCreateType,
    SubscriptionType,
} from "../types/billing/subcription.type";
import { userService } from "./user.service";

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

        if (planType === PlanTypeEnum.PREMIUM) {
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
            price: {
                amount: price.amount,
                currency: CurrencyEnum.UAH,
            },
            activeFrom: new Date(),
            activeTo: null,
            planType: PlanTypeEnum.PREMIUM,
            isActive: true,
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
