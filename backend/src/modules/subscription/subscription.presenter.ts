import { SubscriptionType } from "./types/subcription.type";

export class SubscriptionPresenter {
    private static getBaseFields(subscription: SubscriptionType) {
        return {
            _id: subscription._id,
            userId: subscription.userId,
            planType: subscription.planType,
            isActive: subscription.isActive,
            activeTo: subscription.activeTo,
            activeFrom: subscription.activeFrom,
            price: subscription.price,
            createdAt: subscription.createdAt,
        };
    }

    public static toPrivateResponse(
        subscription: SubscriptionType,
    ): Partial<SubscriptionType> {
        return this.getBaseFields(subscription);
    }

    public static toAdminResponse(
        subscription: SubscriptionType,
    ): Partial<SubscriptionType> {
        return {
            ...this.getBaseFields(subscription),
            isDeleted: subscription.isDeleted,
            deletedAt: subscription.deletedAt,
            updatedAt: subscription.updatedAt,
        };
    }
}
