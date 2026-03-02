import { NextFunction, Request, Response } from "express";

import { EmailEnum } from "../../common/enums/email.enum";
import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { UserCreateDtoType, UserLoginDtoType } from "../user/types/user.type";
import { UserPresenter } from "../user/user.presenter";
import { ActionTokenEnum } from "./enums/action-token.enum";
import { authService } from "./serivces/auth.service";
import { TokenPayloadType } from "./token.type";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as UserCreateDtoType;
            const data = await authService.signUp(dto);
            const presented = {
                user: UserPresenter.toPrivateResponse(data.user),
                tokens: data.tokens,
            };
            res.status(HttpStatusEnum.CREATED).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as UserLoginDtoType;
            const data = await authService.signIn(dto);
            const presented = {
                user: UserPresenter.toPrivateResponse(data.user),
                tokens: data.tokens,
            };
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = res.locals.tokenPayload as TokenPayloadType;
            const refreshToken = res.locals.token as string;
            const data = await authService.refresh(payload, refreshToken);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await authService.verify(userId);
            const presented = UserPresenter.toPrivateResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async requestEmailVerification(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { email } = req.body as { email: string };
            await authService.sendAuthActionEmail(email, {
                emailType: EmailEnum.VERIFY_USER,
                tokenType: ActionTokenEnum.VERIFY_USER,
                path: "/verify",
            });
            res.status(HttpStatusEnum.OK).json({
                message: "Verification email sent",
            });
        } catch (e: unknown) {
            next(e);
        }
    }

    public async requestRecoverPassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { email } = req.body as { email: string };
            await authService.sendAuthActionEmail(email, {
                emailType: EmailEnum.RECOVER_PASSWORD,
                tokenType: ActionTokenEnum.RECOVER_PASSWORD,
                path: "/reset-password",
            });
            res.status(HttpStatusEnum.OK).json({
                message: "Recovery email sent",
            });
        } catch (e: unknown) {
            next(e);
        }
    }

    public async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const { password } = req.body as { password: string };
            const data = await authService.resetPassword(userId, password);
            const presented = {
                user: UserPresenter.toPrivateResponse(data.user),
                tokens: data.tokens,
            };
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const refreshToken = res.locals.token as string;
            await authService.logout(userId, refreshToken);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async logoutFromAllDevices(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            await authService.logoutFromAllDevices(userId);
            res.sendStatus(HttpStatusEnum.NO_CONTENT);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const authController = new AuthController();
