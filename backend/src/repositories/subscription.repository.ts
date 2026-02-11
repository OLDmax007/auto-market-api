import { Subscription } from "../models/billing/subscription.model";
import {
    SubscriptionCreateType,
    SubscriptionType,
} from "../types/billing/subcription.type";

class SubscriptionRepository {
    public getById(id: string): Promise<SubscriptionType> {
        return Subscription.findById(id);
    }

    public create(dto: SubscriptionCreateType): Promise<SubscriptionType> {
        return Subscription.create(dto);
    }

    public updateById(
        id: string,
        dto: Partial<Omit<SubscriptionCreateType, "userId">>,
    ): Promise<SubscriptionType> {
        return Subscription.findByIdAndUpdate(id, dto, { new: true });
    }
}

export const subscriptionRepository = new SubscriptionRepository();
