import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { TokenPairType } from "../types/token.type";
import { UserCreateDtoType, UserType } from "../types/user.type";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
    public async signUp(
        dto: UserCreateDtoType,
    ): Promise<{ user: UserType; tokens: TokenPairType }> {
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

        return { user, tokens };
    }
    public signIn() {}
}

export const authService = new AuthService();
