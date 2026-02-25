import { Router } from "express";

import { subscriptionController } from "../controllers/subscription.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.patch(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.SUBSCRIPTION_SET_PLAN,
    ),
    subscriptionController.setSubscriptionPlanByUserId,
);

router.patch(
    "/:userId/activate",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.SUBSCRIPTION_ACTIVATE,
    ),
    subscriptionController.activate,
);

router.patch(
    "/:userId/deactivate",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.SUBSCRIPTION_DEACTIVATE,
    ),
    subscriptionController.deactivate,
);

export const subscriptionRouter = router;
