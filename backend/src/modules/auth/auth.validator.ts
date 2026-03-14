import Joi from "joi";

import { UserCreateDtoType, UserLoginDtoType } from "../user/types/user.type";
import { UserBaseSchema } from "../user/validators/user.base.schema";

export class AuthValidator {
    static readonly register = Joi.object<UserCreateDtoType>({
        firstName: UserBaseSchema.firstName.required(),
        lastName: UserBaseSchema.lastName.required(),
        age: UserBaseSchema.age.required(),
        email: UserBaseSchema.email.required(),
        password: UserBaseSchema.password.required(),
    });

    static readonly login = Joi.object<UserLoginDtoType>({
        email: UserBaseSchema.email.required(),
        password: UserBaseSchema.password.required(),
    });

    static readonly sendEmail = Joi.object({
        email: UserBaseSchema.email.required(),
    });
    static readonly resetPassword = Joi.object({
        password: UserBaseSchema.password.required(),
    });
}
