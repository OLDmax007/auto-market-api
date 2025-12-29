import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { TokenPairType } from "../types/token.type";
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

        const user = await userService.create({
            ...dto,
            password,
        });

        if (!user) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Problem with register user",
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
}

export const authService = new AuthService();
