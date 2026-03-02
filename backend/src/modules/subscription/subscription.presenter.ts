import { SubscriptionType } from "./types/subcription.type";

export class SubscriptionPresenter {
    private static getBaseFields(subscription: any): Partial<SubscriptionType> {
        const sub = subscription._doc || subscription;
        return {
            _id: sub._id,
            userId: sub.userId,
            planType: sub.planType,
            isActive: sub.isActive,
            activeTo: sub.activeTo,
            activeFrom: sub.activeFrom,
            price: sub.price,
            createdAt: sub.createdAt,
        };
    }

    public static toResponse(
        subscription: SubscriptionType,
    ): Partial<SubscriptionType> {
        return this.getBaseFields(subscription);
    }

    public static toAdminResponse(
        subscription: SubscriptionType,
    ): Partial<SubscriptionType> {
        return {
            ...this.getBaseFields(subscription),
            updatedAt: subscription.updatedAt,
        };
    }
}
