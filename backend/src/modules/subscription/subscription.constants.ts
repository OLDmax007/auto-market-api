import { CurrencyEnum } from "../../common/enums/currency.enum";
import { SubscriptionPlanEnum } from "./enums/subscription-plan.enum";

export const SUBSCRIPTION_PLANS = {
    [SubscriptionPlanEnum.BASIC]: {
        price: 0,
        currency: CurrencyEnum.UAH,
        maxListingsLimit: 1,
    },
    [SubscriptionPlanEnum.PREMIUM]: {
        price: 1000,
        currency: CurrencyEnum.UAH,
        maxListingsLimit: Infinity,
    },
};
