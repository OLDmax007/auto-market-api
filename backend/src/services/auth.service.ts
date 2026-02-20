import { mainConfig } from "../configs/main.config";
import { emailConstants } from "../constants/email-data";
import { ActionTokenEnum } from "../enums/action-token.enum";
import { CurrencyEnum } from "../enums/currency.enum";
import { EmailEnum } from "../enums/email.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { ApiError } from "../errors/api.error";
import { ensureIsActive } from "../helpers/ensure.helper";
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
import { userAccessService } from "./user-access.service";

class AuthService {
    public async signUp(
        dto: UserCreateDtoType,
    ): Promise<{ user: UserType; tokens: TokenPairType }> {
        await userAccessService.checkEmailUniqueness(dto.email);
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

        const payload = buildTokenPayload(user);

        const tokens = tokenService.generateTokens(payload);

        await tokenRepository.create({
            ...tokens,
            userId: user._id,
        });

        const token = tokenService.generateActionToken(
            payload,
            ActionTokenEnum.VERIFY_USER,
        );

        emailService
            .sendEmail(user.email, emailConstants.WELCOME, {
                catalogLink: buildLink("/cars/makes"),
                verifyLink: buildLink("/verify", token),
            })
            .catch((err) => {
                console.error("Failed to send welcome email:", err);
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

        ensureIsActive(user.isActive, "Your account is deactivated");

        const sessions = await tokenRepository.getManyByUserId(user._id);
        if (sessions.length >= mainConfig.MAX_SESSIONS) {
            const oldSession = sessions[0];
            await tokenRepository.deleteOneByParams(oldSession);
        }

        const isValidPassword = await passwordService.comparePassword(
            dto.password,
            user.password,
        );

        if (!isValidPassword) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Email or password is incorrect",
            );
        }

        const payload = buildTokenPayload(user);

        const tokens = tokenService.generateTokens(payload);

        await tokenRepository.create({
            ...tokens,
            userId: user._id,
        });

        return { user, tokens };
    }

    public async refresh(
        payload: TokenPayloadType,
        refreshTokenInput: string,
    ): Promise<TokenType> {
        await tokenRepository.deleteOneByParams({
            userId: payload.userId,
            refreshToken: refreshTokenInput,
        });
        const cleanPayload = buildTokenPayload(payload);
        const tokens = tokenService.generateTokens(cleanPayload);
        return tokenRepository.create({
            ...tokens,
            userId: payload.userId,
        });
    }

    public verify = async (userId: string): Promise<UserType> => {
        const user = await userService.getById(userId);
        ensureIsActive(user.isActive, "Your account is deactivated");
        userAccessService.checkIsNotVerified(user.isVerified);
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
            "If an account with this email exists, a message has been sent to your email",
        );

        if (config.tokenType === ActionTokenEnum.VERIFY_USER) {
            userAccessService.checkIsNotVerified(user.isVerified);
        }

        ensureIsActive(user.isActive, "Cannot send email to inactive account");

        const payload = buildTokenPayload(user);

        const token = tokenService.generateActionToken(
            payload,
            config.tokenType,
        );

        try {
            await emailService.sendEmail(
                user.email,
                emailConstants[config.emailType],
                {
                    link: buildLink(config.path, token),
                },
            );
        } catch (e) {
            console.error(`Email error to ${user.email}:`, e);
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Email delivery failed. Please check your provider.",
            );
        }

        return user;
    };

    public resetPassword = async (
        userId: string,
        password: string,
    ): Promise<UserType> => {
        const user = await userService.getById(userId);
        ensureIsActive(user.isActive, "Your account is deactivated");

        const hashedPassword = await passwordService.hashPassword(password);

        return userRepository.updateById(userId, {
            password: hashedPassword,
        });
    };

    public async logout(
        userId: string,
        refreshTokenInput: string,
    ): Promise<void> {
        const { refreshToken } = await tokenRepository.getOneByParams({
            userId,
            refreshToken: refreshTokenInput,
        });

        await tokenRepository.deleteOneByParams({ userId, refreshToken });
    }

    public async logoutFromAllDevices(userId: string): Promise<void> {
        await tokenRepository.deleteAllByUserId(userId);
    }
}

export const authService = new AuthService();
