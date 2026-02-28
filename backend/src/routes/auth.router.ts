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
    authMiddleware.checkActionToken(ActionTokenEnum.VERIFY_USER),
    authController.verify,
);

router.post(
    "/verify/resend",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    authController.requestEmailVerification,
);

router.post("/recovery-password", authController.requestRecoverPassword);

router.patch(
    "/reset-password",
    authMiddleware.checkActionToken(ActionTokenEnum.RECOVER_PASSWORD),
    authController.resetPassword,
);

router.delete(
    "/logout",
    authMiddleware.checkToken(TokenTypeEnum.REFRESH),
    authController.logout,
);

router.delete(
    "/logout-all",
    authMiddleware.checkToken(TokenTypeEnum.REFRESH),
    authController.logoutFromAllDevices,
);

export const authRouter = router;
