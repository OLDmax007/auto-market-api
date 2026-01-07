import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);

router.post(
    "/refresh",
    authMiddleware.checkToken(TokenTypeEnum.REFRESH),
    authController.refresh,
);

export const authRouter = router;
