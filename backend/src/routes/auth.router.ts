import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenEnum } from "../enums/action-token.enum";
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

router.patch(
    "/verify",
    authMiddleware.checkActionToken(ActionTokenEnum.VERIFY),
    authController.verify,
);

router.post(
    "/verify/resend",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    authController.requestEmailVerification,
);

export const authRouter = router;
