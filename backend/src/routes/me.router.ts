import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.get(
    "/",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_GET),
    userController.getMe,
);

router.patch(
    "/",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_UPDATE),
    userController.updateMe,
);

router.patch(
    "/close",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_DEACTIVATE),
    userController.closeMe,
);

router.patch(
    "/become-seller",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_BECOME_SELLER),
    userController.becomeSeller,
);
router.patch(
    "/upgrade-plan",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_UPGRADE_PLAN),
    userController.upgradeToPremium,
);
router.patch(
    "/top-up-balance",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_TOP_UP),
    userController.topUpBalance,
);

export const meRouter = router;
