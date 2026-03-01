import { UpdateEntityType } from "../../../common/types/base.type";
import { Subscription } from "../models/subscription.model";
import {
    SubscriptionCreateType,
    SubscriptionType,
} from "../types/subcription.type";

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
        return Subscription.findByIdAndUpdate(id, dto, { new: true });
    }

    public deleteById(id: string): Promise<SubscriptionType> {
        return Subscription.findByIdAndDelete(id);
    }
}

export const subscriptionRepository = new SubscriptionRepository();
