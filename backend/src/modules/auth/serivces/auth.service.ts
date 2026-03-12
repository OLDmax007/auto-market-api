import { randomUUID } from "node:crypto";

import { mainConfig } from "../../../common/configs/main.config";
import { EMAIL_DATA } from "../../../common/constants/email-data.constants";
import { EmailEnum } from "../../../common/enums/email.enum";
import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { ensureIsActive } from "../../../common/helpers/ensure.helper";
import { buildLink } from "../../../common/helpers/link-builder.helper";
import { emailService } from "../../../common/services/email.service";
import { subscriptionService } from "../../subscription/subscription.service";
import { userRepository } from "../../user/repositories/user.repository";
import { passwordService } from "../../user/services/password.service";
import { userService } from "../../user/services/user.service";
import { userAccessService } from "../../user/services/user-access.service";
import {
    UserCreateDtoType,
    UserLoginDtoType,
    UserType,
} from "../../user/types/user.type";
import { ActionTokenEnum } from "../enums/action-token.enum";
import { tokenRepository } from "../token.repository";
import { TokenPairType, TokenPayloadType, TokenType } from "../token.type";
import { tokenService } from "./token.service";

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
        });

        const user = await userRepository.updateById(createdUser._id, {
            subscriptionId,
        });

        const tokens = tokenService.generateTokens({
            userId: user._id,
            sessionId: randomUUID(),
        });

        await tokenRepository.create({
            ...tokens,
            userId: user._id,
        });

        const token = tokenService.generateActionToken(
            { userId: user._id },
            ActionTokenEnum.VERIFY_USER,
        );

        console.log(`[TEST] Verify Token: ${token}`);

        emailService
            .sendEmail(user.email, EMAIL_DATA.WELCOME, {
                catalogLink: buildLink("/cars/makes"),
                verifyLink: buildLink("/verify", token),
                token,
            })
            .catch();

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

        const tokens = tokenService.generateTokens({
            userId: user._id,
            sessionId: randomUUID(),
        });

        await tokenRepository.create({
            ...tokens,
            userId: user._id,
        });

        return { user, tokens };
    }

    public async refresh(
        payload: TokenPayloadType,
        refreshTokenInput: string,
    ): Promise<Pick<TokenType, "accessToken" | "refreshToken">> {
        const result = await tokenRepository.deleteOneByParams({
            userId: payload.userId,
            refreshToken: refreshTokenInput,
        });
        if (!result || result.deletedCount === 0) {
            throw new ApiError(
                HttpStatusEnum.UNAUTHORIZED,
                "Invalid session. Please login again.",
            );
        }
        const tokens = tokenService.generateTokens({
            userId: payload.userId,
            sessionId: payload.sessionId,
        });
        const { accessToken, refreshToken } = await tokenRepository.create({
            ...tokens,
            userId: payload.userId,
        });

        return { accessToken, refreshToken };
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

    public sendVerificationEmail = async (userId: string): Promise<void> => {
        const user = await userService.getById(userId);

        userAccessService.checkIsNotVerified(user.isVerified);
        ensureIsActive(user.isActive, "Account is disabled");
        const token = tokenService.generateActionToken(
            { userId: user._id },
            ActionTokenEnum.VERIFY_USER,
        );

        console.log(`[TEST] Verify Token: ${token}`);

        await emailService.sendEmail(
            user.email,
            EMAIL_DATA[EmailEnum.VERIFY_USER],
            {
                link: buildLink("/verify", token),
                token,
            },
        );
    };

    public sendRecoveryEmail = async (inputEmail: string): Promise<void> => {
        const user = await userService.getByEmail(
            inputEmail,
            "If an account with this email exists, a message has been sent to your email",
        );

        ensureIsActive(user.isActive, "Account is disabled");
        const token = tokenService.generateActionToken(
            { userId: user._id },
            ActionTokenEnum.RECOVER_PASSWORD,
        );

        console.log(`[TEST] Reset password Token: ${token}`);

        await emailService.sendEmail(
            user.email,
            EMAIL_DATA[EmailEnum.RECOVER_PASSWORD],
            {
                link: buildLink("/reset-password", token),
                token,
            },
        );
    };

    public resetPassword = async (
        payload: TokenPayloadType,
        password: string,
    ): Promise<{ user: UserType; tokens: TokenPairType }> => {
        const user = await userService.getById(payload.userId);
        ensureIsActive(user.isActive, "Your account is deactivated");
        const isSamePassword = await passwordService.comparePassword(
            password,
            user.password,
        );

        if (isSamePassword) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Create new password!",
            );
        }

        const hashedPassword = await passwordService.hashPassword(password);

        await userRepository.updateById(payload.userId, {
            password: hashedPassword,
        });

        await this.logoutFromAllDevices(user._id);

        const tokens = tokenService.generateTokens({
            userId: user._id,
            sessionId: payload.sessionId,
        });

        await tokenRepository.create({
            ...tokens,
            userId: user._id,
        });

        return { user, tokens };
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
