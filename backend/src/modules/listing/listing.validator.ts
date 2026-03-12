import Joi from "joi";

import { CurrencyEnum } from "../../common/enums/currency.enum";
import { CarMakeEnum } from "../car/car.enum";
import { RegionEnum } from "../location/enums/region.enum";

export class ListingValidator {
    private static title = Joi.string().min(3).max(100).trim().messages({
        "string.base": "Title must be a string",
        "string.min": "Title is too short. Minimum length is 3 characters",
        "string.max": "Title is too long. Maximum length is 100 characters",
        "any.required": "Title is required",
    });

    private static description = Joi.string()
        .min(10)
        .max(2500)
        .trim()
        .messages({
            "string.min":
                "Description is too short. Minimum length is 10 characters",
            "string.max":
                "Description is too long. Maximum length is 2500 characters",
            "any.required": "Description is required",
        });

    private static make = Joi.string()
        .valid(...Object.values(CarMakeEnum))
        .lowercase()
        .messages({
            "any.only": "Please select a valid car make from the list",
            "any.required": "Car make is required",
        });

    private static model = Joi.string()
        .min(1)
        .max(50)
        .trim()
        .lowercase()
        .messages({
            "string.empty": "Model cannot be empty",
            "string.min": "Model name must be at least 1 character",
            "string.max": "Model name cannot exceed 50 characters",
            "any.required": "Model is required",
        });

    private static year = Joi.number()
        .integer()
        .min(1970)
        .max(new Date().getFullYear() + 1)
        .messages({
            "number.min": "Year cannot be earlier than 1970",
            "number.max": `Year cannot be beyond ${new Date().getFullYear() + 1}`,
            "number.base": "Year must be a number",
            "any.required": "Manufacturing year is required",
        });

    private static mileage_km = Joi.number()
        .integer()
        .min(0)
        .max(1000000)
        .messages({
            "number.min": "Mileage cannot be negative",
            "number.max": "Mileage is too high. Maximum is 1,000,000 km",
            "number.base": "Mileage must be a number",
            "any.required": "Mileage is required",
        });

    private static region = Joi.string()
        .lowercase()
        .valid(...Object.values(RegionEnum))
        .messages({
            "any.only": "Please select a valid region from the list",
            "any.required": "Region is required",
        });

    private static city = Joi.string().min(2).max(50).trim().messages({
        "string.min": "City name is too short. Minimum 2 characters",
        "string.max": "City name is too long. Maximum 50 characters",
        "any.required": "City is required",
    });

    private static enteredPrice = Joi.object({
        amount: Joi.number()
            .positive()
            .required()
            .when("currency", {
                is: Joi.string().valid(CurrencyEnum.UAH).insensitive(),
                then: Joi.number().min(5000).max(10000000).messages({
                    "number.min": "Price is too low. Minimum for UAH is 5,000",
                    "number.max":
                        "Price is too high. Maximum for UAH is 10,000,000",
                }),
            })
            .when("currency", {
                is: Joi.string()
                    .valid(CurrencyEnum.USD, CurrencyEnum.EUR)
                    .insensitive(),
                then: Joi.number().min(200).max(250000).messages({
                    "number.min":
                        "Price is too low. Minimum for USD/EUR is 200",
                    "number.max":
                        "Price is too high. Maximum for USD/EUR is 250,000",
                }),
            })
            .messages({
                "number.positive": "Price must be a positive number",
                "any.required": "Price amount is required",
            }),
        currency: Joi.string()
            .uppercase()
            .valid(...Object.values(CurrencyEnum))
            .required()
            .messages({
                "any.only": `Please select a valid currency: ${Object.values(CurrencyEnum).join(", ")}`,
                "any.required": "Currency is required",
            }),
    });

    public static readonly create = Joi.object({
        title: this.title.required(),
        description: this.description.required(),
        make: this.make.required(),
        model: this.model.required(),
        year: this.year.required(),
        mileage_km: this.mileage_km.required(),
        region: this.region.required(),
        city: this.city.required(),
        enteredPrice: this.enteredPrice.required(),
    });

    public static readonly update = Joi.object({
        title: this.title,
        description: this.description,
        make: this.make,
        model: this.model,
        year: this.year,
        mileage_km: this.mileage_km,
        region: this.region,
        city: this.city,
        enteredPrice: this.enteredPrice,
    })
        .min(1)
        .messages({
            "object.min": "Provide at least one field to update",
        });

    public static readonly updateByAdmin = Joi.object({
        title: this.title,
        description: this.description,
        make: this.make,
        model: this.model,
        year: this.year,
        mileage_km: this.mileage_km,
        region: this.region,
        city: this.city,
        enteredPrice: this.enteredPrice,
        isProfanity: Joi.boolean().valid(false).messages({
            "any.only":
                "Use 'isProfanity' field optional to unblock (set to false) after the content has been cleaned",
        }),
    })
        .min(1)
        .messages({
            "object.min": "Admin must modify at least one field",
        });

    public static readonly updateByManager = Joi.object({
        title: this.title,
        description: this.description,
    })
        .min(1)
        .messages({
            "object.min": "Manager must update either title or description",
        });
}
