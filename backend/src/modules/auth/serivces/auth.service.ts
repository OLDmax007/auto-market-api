import { mainConfig } from "../../../common/configs/main.config";
import { EMAIL_DATA } from "../../../common/constants/email-data.constants";
import { EmailEnum } from "../../../common/enums/email.enum";
import { HttpStatusEnum } from "../../../common/enums/http-status.enum";
import { ApiError } from "../../../common/errors/api.error";
import { ensureIsActive } from "../../../common/helpers/ensure.helper";
import { buildLink } from "../../../common/helpers/link-builder.helper";
import { buildTokenPayload } from "../../../common/helpers/payload.helper";
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
            .sendEmail(user.email, EMAIL_DATA.WELCOME, {
                catalogLink: buildLink("/cars/makes"),
                verifyLink: buildLink("/verify", token),
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
        const cleanPayload = buildTokenPayload(payload);
        const tokens = tokenService.generateTokens(cleanPayload);
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

    public sendAuthActionEmail = async (
        inputEmail: string,
        config: {
            emailType: EmailEnum;
            tokenType: ActionTokenEnum;
            path: string;
        },
    ): Promise<void> => {
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

        await emailService.sendEmail(user.email, EMAIL_DATA[config.emailType], {
            link: buildLink(config.path, token),
            token,
        });
    };

    public resetPassword = async (
        userId: string,
        password: string,
    ): Promise<{ user: UserType; tokens: TokenPairType }> => {
        const user = await userService.getById(userId);
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

        await userRepository.updateById(userId, {
            password: hashedPassword,
        });

        await this.logoutFromAllDevices(user._id);

        const payload = buildTokenPayload(user);
        const tokens = tokenService.generateTokens(payload);

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
