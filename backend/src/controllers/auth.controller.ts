import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { authService } from "../services/auth.service";
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
}

export const authController = new AuthController();
