import { Router } from "express";

import { authController } from "./auth.controller";
import { authMiddleware } from "./auth.middleware";
import { ActionTokenEnum } from "./enums/action-token.enum";
import { TokenEnum } from "./enums/token.enum";

const router = Router();

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);

router.post(
    "/refresh",
    authMiddleware.checkToken(TokenEnum.REFRESH),
    authController.refresh,
);

router.patch(
    "/verify",
    authMiddleware.checkActionToken(ActionTokenEnum.VERIFY_USER),
    authController.verify,
);

router.post(
    "/verify/resend",
    authMiddleware.checkToken(TokenEnum.ACCESS),
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
    authMiddleware.checkToken(TokenEnum.REFRESH),
    authController.logout,
);

router.delete(
    "/logout-all",
    authMiddleware.checkToken(TokenEnum.REFRESH),
    authController.logoutFromAllDevices,
);

export const authRouter = router;
