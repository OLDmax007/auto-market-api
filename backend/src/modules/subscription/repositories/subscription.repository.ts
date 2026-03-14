import { UpdateEntityType } from "../../../common/types/base.type";
import { Subscription } from "../models/subscription.model";
import {
    SubscriptionCreateType,
    SubscriptionType,
} from "../types/subcription.type";

class SubscriptionRepository {
    public getById(id: string): Promise<SubscriptionType> {
        return Subscription.findOne({ _id: id, isDeleted: false });
    }

    public create(dto: SubscriptionCreateType): Promise<SubscriptionType> {
        return Subscription.create(dto);
    }

    public updateById(
        id: string,
        dto: UpdateEntityType<SubscriptionType>,
    ): Promise<SubscriptionType> {
        return Subscription.findOneAndUpdate(
            { _id: id, isDeleted: false },
            dto,
            {
                new: true,
            },
        );
    }

    public async deleteById(id: string): Promise<SubscriptionType> {
        return Subscription.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
            { new: true },
        );
    }
}

export const subscriptionRepository = new SubscriptionRepository();
