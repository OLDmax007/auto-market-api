import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenEnum } from "../enums/action-token.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);

router.post(
    "/refresh",
    authMiddleware.checkToken(TokenTypeEnum.REFRESH),
    userMiddleware.isActiveUser,
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

router.post("/recovery-password", authController.requestRecoverPassword);

router.patch(
    "/reset-password",
    authMiddleware.checkActionToken(ActionTokenEnum.RECOVER),
    authController.resetPassword,
);

router.delete(
    "/logout",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    authController.logout,
);

router.delete(
    "/logout-all",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    authController.logoutFromAllDevices,
);

export const authRouter = router;
