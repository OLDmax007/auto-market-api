import Joi from "joi";

import { PlatformRoleEnum } from "../enums/platform-role.enum";
import {
    UserUpdateByAdminDtoType,
    UserUpdateDtoType,
} from "../types/user.type";
import { UserBaseSchema } from "./user.base.schema";

export class UserValidator {
    private static isVerified = Joi.boolean().messages({
        "boolean.base": "Verification status must be a boolean (true or false)",
    });

    private static platformRole = Joi.string()
        .valid(...Object.values(PlatformRoleEnum))
        .messages({
            "any.only": `Invalid role. Supported roles are: ${Object.values(PlatformRoleEnum).join(", ")}`,
        });

    static readonly setRole = Joi.object({
        newRole: this.platformRole.required().messages({
            "any.required": "New role is required to perform this action",
        }),
    });

    static readonly updateMe = Joi.object<UserUpdateDtoType>({
        firstName: UserBaseSchema.firstName,
        lastName: UserBaseSchema.lastName,
        age: UserBaseSchema.age,
    })
        .min(1)
        .messages({
            "object.min":
                "You must provide at least one field (firstName, lastName, or age) to update your profile",
        });

    static readonly updateByAdmin = Joi.object<UserUpdateByAdminDtoType>({
        firstName: UserBaseSchema.firstName,
        lastName: UserBaseSchema.lastName,
        age: UserBaseSchema.age,
        email: UserBaseSchema.email,
        isVerified: this.isVerified,
    })
        .min(1)
        .messages({
            "object.min":
                "Admin must modify at least one field: firstName, lastName, age, email, isVerified, or avatar",
        });
}
