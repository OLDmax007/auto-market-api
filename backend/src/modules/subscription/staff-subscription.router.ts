import { Router } from "express";

import { commonMiddleware } from "../../common/middlewares/common.middleware";
import { authMiddleware } from "../auth/auth.middleware";
import { TokenEnum } from "../auth/enums/token.enum";
import { PlatformPermissionEnum } from "../user/enums/platform-permission.enum";
import { roleMiddleware } from "../user/middlewares/role.middleware";
import { userMiddleware } from "../user/middlewares/user.middleware";
import { subscriptionController } from "./subscription.controller";
import { SubscriptionValidator } from "./subscription.validator";

const router = Router();

router.use(
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
);

router.patch(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.SUBSCRIPTION_SET_PLAN,
        "You do not have permission to change user subscription plans",
    ),
    commonMiddleware.validateBody(SubscriptionValidator.setPlan),
    subscriptionController.setSubscriptionPlanByUserId,
);

router.patch(
    "/:userId/activate",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.SUBSCRIPTION_ACTIVATE,
        "You do not have permission to activate user subscriptions",
    ),
    subscriptionController.activate,
);

router.patch(
    "/:userId/deactivate",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.SUBSCRIPTION_DEACTIVATE,
        "You do not have permission to deactivate user subscriptions",
    ),
    subscriptionController.deactivate,
);

export const staffSubscriptionRouter = router;
