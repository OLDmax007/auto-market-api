import { NextFunction, Request, Response } from "express";

import { ActionTokenEnum } from "../enums/action-token.enum";
import { EmailEnum } from "../enums/email.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { authService } from "../services/auth.service";
import { TokenPayloadType } from "../types/token.type";
import { UserCreateDtoType, UserLoginDtoType } from "../types/user.type";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as UserCreateDtoType;
            const data = await authService.signUp(dto);
            res.status(HttpStatusEnum.CREATED).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as UserLoginDtoType;
            const data = await authService.signIn(dto);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = res.locals.payload as TokenPayloadType;
            const data = await authService.refresh(payload);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.payload as TokenPayloadType;
            const data = await authService.verify(userId);
            res.status(HttpStatusEnum.OK).json(data);
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
            const data = await authService.sendAuthActionEmail(email, {
                emailType: EmailEnum.VERIFY_USER,
                tokenType: ActionTokenEnum.VERIFY,
                path: "/verify",
            });
            res.status(HttpStatusEnum.OK).json(data);
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
            const data = await authService.sendAuthActionEmail(email, {
                emailType: EmailEnum.RECOVER_PASSWORD,
                tokenType: ActionTokenEnum.RECOVER,
                path: "/reset-password",
            });
            res.status(HttpStatusEnum.OK).json(data);
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
            const { userId } = res.locals.payload as TokenPayloadType;
            const { password } = req.body as { password: string };
            const data = await authService.resetPassword(userId, password);
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const authController = new AuthController();
