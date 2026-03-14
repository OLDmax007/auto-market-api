import Joi from "joi";

import { SubscriptionPlanEnum } from "./enums/subscription-plan.enum";

export class SubscriptionValidator {
    private static planType = Joi.string()
        .trim()
        .lowercase()
        .valid(...Object.values(SubscriptionPlanEnum))
        .required()
        .messages({
            "string.base": "Subscription plan must be a string",
            "string.empty": "Subscription plan cannot be empty",
            "any.only": `Invalid plan. Available: ${Object.values(SubscriptionPlanEnum).join(", ")}`,
            "any.required": "Subscription plan is required",
        });

    static readonly setPlan = Joi.object({
        newPlan: this.planType,
    });
}
