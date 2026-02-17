import { emailConstants } from "../constants/email-data";
import { ActionTokenEnum } from "../enums/action-token.enum";
import { CurrencyEnum } from "../enums/currency.enum";
import { EmailEnum } from "../enums/email.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { ApiError } from "../errors/api.error";
import { buildLink } from "../helpers/link-builder.helper";
import { buildTokenPayload } from "../helpers/payload.helper";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import {
    TokenPairType,
    TokenPayloadType,
    TokenType,
} from "../types/token.type";
import {
    UserCreateDtoType,
    UserLoginDtoType,
    UserType,
} from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { subscriptionService } from "./subscription.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
    public async signUp(
        dto: UserCreateDtoType,
    ): Promise<{ user: UserType; tokens: TokenPairType }> {
        await userService.checkEmailUniqueness(dto.email);
        const password = await passwordService.hashPassword(dto.password);

        const createdUser = await userService.create({
            ...dto,
            password,
        });

        if (!createdUser) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Problem with register user",
            );
        }

        const { _id: subscriptionId } = await subscriptionService.create({
            userId: createdUser._id,
            planType: PlanTypeEnum.BASIC,
            price: {
                amount: 0,
                currency: CurrencyEnum.UAH,
            },
            activeFrom: null,
            activeTo: null,
            isActive: true,
        });

        const user = await userRepository.updateById(createdUser._id, {
            subscriptionId,
        });

        const { _id: userId, email } = user;

        const payload = buildTokenPayload(user);

        const tokens = tokenService.generateTokens(payload);

        await tokenRepository.create({
            ...tokens,
            userId,
        });

        const token = tokenService.generateActionToken(
            payload,
            ActionTokenEnum.VERIFY,
        );

        await emailService.sendEmail(email, emailConstants.WELCOME, {
            catalogLink: buildLink("/cars/makes"),
            verifyLink: buildLink("/verify", token),
        });

        return { user, tokens };
    }

    public async signIn(
        dto: UserLoginDtoType,
    ): Promise<{ user: UserType; tokens: TokenPairType }> {
        const user = await userService.getByEmail(
            dto.email,
            "Email or password is incorrect",
        );

        await tokenRepository.deleteAllByUserId(user._id);

        const isValidPassword = await passwordService.comparePassword(
            dto.password,
            user.password,
        );

        if (!isValidPassword) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Email or password is invalid",
            );
        }

        const { _id: userId, isActive } = user;

        userService.checkIsActive(isActive);

        const payload = buildTokenPayload(user);

        const tokens = tokenService.generateTokens(payload);

        await tokenRepository.create({
            ...tokens,
            userId,
        });

        return { user, tokens };
    }

    public async refresh(
        { userId, firstName, lastName, email }: TokenPayloadType,
        refreshToken: string,
    ): Promise<TokenType> {
        const tokens = tokenService.generateTokens({
            userId,
            firstName,
            lastName,
            email,
        });
        return tokenRepository.create({
            ...tokens,
            userId,
        });
    }

    public verify = async (userId: string): Promise<UserType> => {
        const user = await userService.getById(userId);
        userService.checkIsActive(user.isActive);
        return userRepository.updateById(userId, {
            isActive: true,
            isVerified: true,
        });
    };

    public sendAuthActionEmail = async (
        inputEmail: string,
        config: {
            emailType: EmailEnum;
            tokenType: ActionTokenEnum;
            path: string;
        },
    ): Promise<UserType> => {
        const user = await userService.getByEmail(
            inputEmail,
            "Email is incorrect",
        );

        userService.checkIsActive(user.isActive);

        const payload = buildTokenPayload(user);

        const token = tokenService.generateActionToken(
            payload,
            config.tokenType,
        );

        await emailService.sendEmail(
            user.email,
            emailConstants[config.emailType],
            {
                link: buildLink(config.path, token),
            },
        );
        return user;
    };

    public resetPassword = async (
        userId: string,
        password: string,
    ): Promise<UserType> => {
        const user = await userService.getById(userId);
        userService.checkIsActive(user.isActive);

        const hashedPassword = await passwordService.hashPassword(password);

        return userRepository.updateById(userId, {
            password: hashedPassword,
        });
    };
}

export const authService = new AuthService();
