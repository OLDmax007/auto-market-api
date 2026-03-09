import Joi from "joi";

import { REGEX_CONSTANTS } from "../../common/constants/regex.constants";
import { CarMakeEnum } from "./car.enum";

export class CarValidator {
    private static readonly make = Joi.string()
        .trim()
        .required()
        .lowercase()
        .valid(...Object.values(CarMakeEnum))
        .messages({
            "string.empty": "Car make cannot be empty",
            "any.required": "Car make is required",
            "any.only":
                "The car make you provided is not supported. Please choose a valid one from the list",
        });

    private static readonly missingMake = Joi.string()
        .trim()
        .required()
        .lowercase()
        .invalid(...Object.values(CarMakeEnum))
        .messages({
            "string.empty": "Car make cannot be empty",
            "any.required": "Car make is required",
            "any.invalid":
                "This car make already exists on our platform. Please check the existing list",
        });

    private static readonly model = Joi.string()
        .trim()
        .required()
        .lowercase()
        .invalid(...Object.values(CarMakeEnum))
        .min(1)
        .max(30)
        .regex(REGEX_CONSTANTS.CAR.MODEL)
        .messages({
            "string.empty": "Model name cannot be empty",
            "string.min": "Model name must be at least 1 character",
            "string.max": "Model name is too long. Maximum is 30 characters",
            "string.pattern.base":
                "Model name must contain only English letters and numbers. Use a single hyphen (-) as a separator without spaces (e.g., 'x-5')",
            "any.required": "Model name is required",
            "any.invalid":
                "This is a car make, not a model. Please enter a specific model name",
        });

    static readonly makeParam = Joi.object({
        make: CarValidator.make,
    });

    static readonly sendMissingModel = Joi.object({
        make: CarValidator.make,
        model: CarValidator.model,
    });

    static readonly sendMissingMake = Joi.object({
        make: CarValidator.missingMake,
    });
}
