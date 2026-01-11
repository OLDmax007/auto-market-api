import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PaymentStatusEnum } from "../enums/payment-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { PlatformRoleEnum } from "../enums/platform-role.enum";
import { ApiError } from "../errors/api.error";
import { paymentRepository } from "../repositories/payment.repository";
import { subscriptionRepository } from "../repositories/subscription.repository";
import { userRepository } from "../repositories/user.repository";
import { CurrencyType } from "../types/base.type";
import { SubscriptionType } from "../types/billing/subcription.type";
import { UserCreateDtoType, UserType } from "../types/user.type";
import { platformRoleService } from "./platform-role.service";
import { privatBankService } from "./privatbank.service";

class UserService {
    public getAll(): Promise<UserType[]> {
        return userRepository.getAll();
    }

    public getById(id: string): Promise<UserType> {
        const user = userRepository.getById(id);

        if (!user) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "User not found");
        }
        return user;
    }

    public async create(dto: UserCreateDtoType): Promise<UserType> {
        const { _id } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.VISITOR,
        );

        return userRepository.create({
            platformRoleId: _id,
            ...dto,
        });
    }

    public async becomeSeller(id: string): Promise<UserType> {
        const { _id: sellerRoleId } = await platformRoleService.getPlatformRole(
            PlatformRoleEnum.SELLER,
        );

        const user = await this.getById(id);

        if (String(user.platformRoleId) === String(sellerRoleId)) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User is already seller",
            );
        }
        return userRepository.updateById(id, {
            platformRoleId: sellerRoleId,
        });
    }

    public async checkEmailUniqueness(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError(
                HttpStatusEnum.CONFLICT,
                "User already is exists",
            );
        }
    }

    public async upgradeToPremium(id: string): Promise<SubscriptionType> {
        // await exchangeRateService.exchangeRates();

        const { _id: userId, subscriptionId } = await userService.getById(id);

        const userSubscription =
            await subscriptionRepository.getById(subscriptionId);

        if (
            userSubscription &&
            userSubscription.planType === PlanTypeEnum.PREMIUM
        ) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "User already has PREMIUM subscription",
            );
        }
        const price = { amount: 500, currency: CurrencyEnum.UAH };

        const today = new Date();

        const { balance } = await userRepository.updateById(userId, {
            balance: {
                amount: 10000,
                currency: CurrencyEnum.UAH,
            },
        });

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
            paidAt: today,
            status: PaymentStatusEnum.SUCCESS,
        });

        await userRepository.updateById(userId, {
            balance: {
                amount: balance.amount - price.amount,
                currency: CurrencyEnum.UAH,
            },
        });

        const activeTo = new Date(today);
        activeTo.setDate(activeTo.getDate() + 30);

        return subscriptionRepository.updateById(subscriptionId, {
            price: {
                amount: price.amount,
                currency: CurrencyEnum.UAH,
            },
            activeFrom: today,
            activeTo,
            planType: PlanTypeEnum.PREMIUM,
            isActive: true,
        });
    }
    public async topUpBalance(
        id: string,
        { amount, currency }: CurrencyType,
    ): Promise<{ balance: CurrencyType; credited: CurrencyType }> {
        let { balance } = await userService.getById(id);

        const convertedMoney = await privatBankService.convertToUAH(
            amount,
            currency,
        );

        balance.amount += convertedMoney;

        await userRepository.updateById(id, {
            balance: {
                amount: balance.amount,
                currency: CurrencyEnum.UAH,
            },
        });

        return { balance, credited: { amount, currency } };
    }
}

export const userService = new UserService();
