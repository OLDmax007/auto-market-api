import { Subscription } from "../models/billing/subscription.model";
import { UpdateEntityType } from "../types/base.type";
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
        dto: UpdateEntityType<SubscriptionType>,
    ): Promise<SubscriptionType> {
        console.log(dto);
        return Subscription.findByIdAndUpdate(id, dto, { new: true });
    }

    public deleteById(id: string): Promise<SubscriptionType> {
        return Subscription.findByIdAndDelete(id);
    }
}

export const subscriptionRepository = new SubscriptionRepository();
