import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { ApiError } from "../errors/api.error";
import { subscriptionRepository } from "../repositories/subscription.repository";
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
import { passwordService } from "./password.service";
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

        const { _id: subscriptionId } = await subscriptionRepository.create({
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

        const {
            _id: userId,
            firstName,
            lastName,
            email,
            platformRoleId,
        } = user;

        const tokens = tokenService.generateTokens({
            userId,
            firstName,
            lastName,
            email,
            platformRoleId,
        });

        await tokenRepository.create({
            ...tokens,
            userId,
        });

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

        const { deletedCount } = await tokenRepository.deleteAllByUserId(
            user._id,
        );

        if (!deletedCount) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Token not found");
        }

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

        const {
            _id: userId,
            firstName,
            lastName,
            email,
            platformRoleId,
        } = user;

        const tokens = tokenService.generateTokens({
            userId,
            firstName,
            lastName,
            email,
            platformRoleId,
        });

        await tokenRepository.create({
            ...tokens,
            userId,
        });

        return { user, tokens };
    }

    public async refresh({
        userId,
        firstName,
        lastName,
        email,
        platformRoleId,
    }: TokenPayloadType): Promise<TokenType> {
        await tokenRepository.deleteAllByUserId(userId);
        const tokens = tokenService.generateTokens({
            userId,
            firstName,
            lastName,
            email,
            platformRoleId,
        });
        return tokenRepository.create({
            ...tokens,
            userId,
        });
    }
}

export const authService = new AuthService();
