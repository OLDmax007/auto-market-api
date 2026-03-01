import { Router } from "express";

import { commonMiddleware } from "../../common/middlewares/common.middleware";
import { authMiddleware } from "../auth/auth.middleware";
import { TokenEnum } from "../auth/enums/token.enum";
import { PlatformPermissionEnum } from "../user/enums/platform-permission.enum";
import { roleMiddleware } from "../user/middlewares/role.middleware";
import { userMiddleware } from "../user/middlewares/user.middleware";
import { subscriptionController } from "./subscription.controller";

const router = Router();

router.patch(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
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
    authMiddleware.checkToken(TokenEnum.ACCESS),
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
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.SUBSCRIPTION_DEACTIVATE,
    ),
    subscriptionController.deactivate,
);

export const subscriptionRouter = router;
