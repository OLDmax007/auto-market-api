import { Router } from "express";

import { commonMiddleware } from "../../common/middlewares/common.middleware";
import { userMiddleware } from "../user/middlewares/user.middleware";
import { authController } from "./auth.controller";
import { authMiddleware } from "./auth.middleware";
import { AuthValidator } from "./auth.validator";
import { ActionTokenEnum } from "./enums/action-token.enum";
import { TokenEnum } from "./enums/token.enum";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(AuthValidator.register),
    authController.signUp,
);
router.post(
    "/sign-in",
    commonMiddleware.validateBody(AuthValidator.login),
    authController.signIn,
);

router.post(
    "/refresh",
    authMiddleware.checkToken(TokenEnum.REFRESH),
    userMiddleware.isActiveUser,
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

router.post(
    "/recovery-password",
    commonMiddleware.validateBody(AuthValidator.sendEmail),
    authController.requestRecoverPassword,
);

router.patch(
    "/reset-password",
    commonMiddleware.validateBody(AuthValidator.resetPassword),
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
