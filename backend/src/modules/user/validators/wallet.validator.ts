import Joi from "joi";

import { CurrencyEnum } from "../../../common/enums/currency.enum";
import { CurrencyAmountType } from "../../rate/rate.type";

export class WalletValidator {
    private static amount = Joi.number()
        .integer()
        .positive()
        .required()
        .when("currency", {
            is: Joi.string().valid(CurrencyEnum.UAH).insensitive(),
            then: Joi.number().min(10).max(100000).messages({
                "number.min": "Minimum top-up amount for UAH is 10",
                "number.max": "Maximum top-up amount for UAH is 100,000",
            }),
        })
        .when("currency", {
            is: Joi.string()
                .valid(CurrencyEnum.USD, CurrencyEnum.EUR)
                .insensitive(),
            then: Joi.number().min(1).max(2500).messages({
                "number.min": "Minimum top-up amount for USD/EUR is 1",
                "number.max": "Maximum top-up amount for USD/EUR is 2,500",
            }),
        })
        .messages({
            "number.base": "Amount must be a number",
            "number.integer": "Amount must be a whole number (no decimals)",
            "number.positive": "Amount must be greater than zero",
            "any.required": "Amount is required",
        });

    private static currency = Joi.string()
        .trim()
        .uppercase()
        .valid(...Object.values(CurrencyEnum))
        .required()
        .messages({
            "any.only": `Supported currencies: ${Object.values(CurrencyEnum).join(", ")}`,
            "any.required": "Currency is required",
        });

    static readonly topUp = Joi.object<CurrencyAmountType>({
        amount: this.amount,
        currency: this.currency,
    });
}
