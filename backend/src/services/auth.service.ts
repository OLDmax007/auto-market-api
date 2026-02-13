import { emailConstants } from "../constants/email-data";
import { ActionTokenEnum } from "../enums/action-token.enum";
import { CurrencyEnum } from "../enums/currency.enum";
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
import { platformRoleService } from "./platform-role.service";
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

        const { _id: userId, firstName, lastName, platformRoleId } = user;

        const { role, permissionIds } =
            await platformRoleService.getPlatformRoleById(platformRoleId);

        const payload = buildTokenPayload(user, role, permissionIds);

        const tokens = tokenService.generateTokens(payload);

        await tokenRepository.create({
            ...tokens,
            userId,
        });

        const token = tokenService.generateActionToken(
            payload,
            ActionTokenEnum.VERIFY,
        );

        await emailService.sendEmail(
            "maxsim.dobrovolskyimd@gmail.com",
            emailConstants.WELCOME,
            {
                firstName,
                lastName,
                catalogLink: buildLink("/cars/mark"),
                verifyLink: buildLink("/verify", token),
            },
        );

        return { user, tokens };
    }

    public async signIn(
        dto: UserLoginDtoType,
    ): Promise<{ user: UserType; tokens: TokenPairType }> {
        const user = await userRepository.getByEmail(dto.email);

        if (!user) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Email or password is invalid",
            );
        }
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

        const { _id: userId, platformRoleId } = user;

        const { permissionIds, role } =
            await platformRoleService.getPlatformRoleById(platformRoleId);

        const payload = buildTokenPayload(user, role, permissionIds);

        const tokens = tokenService.generateTokens(payload);

        await tokenRepository.create({
            ...tokens,
            userId,
        });

        return { user, tokens };
    }

    public async refresh(payload: TokenPayloadType): Promise<TokenType> {
        await tokenRepository.deleteAllByUserId(payload.userId);
        const tokens = tokenService.generateTokens({
            ...payload,
        });
        return tokenRepository.create({
            ...tokens,
            userId: payload.userId,
        });
    }

    public verify = async (userId: string): Promise<UserType> => {
        return userService.update(userId, {
            isActive: true,
            isVerified: true,
        });
    };
}

export const authService = new AuthService();
