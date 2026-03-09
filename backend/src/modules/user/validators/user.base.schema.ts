import Joi from "joi";

import { REGEX_CONSTANTS } from "../../../common/constants/regex.constants";

export const UserBaseSchema = {
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(REGEX_CONSTANTS.USER.NAME)
        .messages({
            "any.required": "First name is a required field",
            "string.empty": "First name cannot be empty",
            "string.min": "First name must be at least 2 characters",
            "string.max": "First name cannot exceed 50 characters",
            "string.pattern.base":
                "First name must start with a capital letter and contain only letters",
        }),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(60)
        .pattern(REGEX_CONSTANTS.USER.NAME)
        .messages({
            "any.required": "Last name is a required field",
            "string.empty": "Last name cannot be empty",
            "string.min": "Last name must be at least 2 characters",
            "string.max": "Last name cannot exceed 60 characters",
            "string.pattern.base":
                "Last name must start with a capital letter and contain only letters",
        }),

    age: Joi.number().integer().min(18).max(120).messages({
        "any.required": "Age is a required field",
        "number.base": "Age must be a number",
        "number.min": "Minimum age is 18",
        "number.max": "Age cannot exceed 120",
    }),

    email: Joi.string().trim().lowercase().email().max(100).messages({
        "any.required": "Email is a required field",
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid email format",
        "string.max": "Email is too long",
    }),

    password: Joi.string()
        .min(8)
        .max(50)
        .pattern(REGEX_CONSTANTS.USER.PASSWORD)
        .messages({
            "any.required": "Password is a required field",
            "string.empty": "Password cannot be empty",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password is too long",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
};
