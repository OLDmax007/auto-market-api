import { Router } from "express";

import { subscriptionController } from "../controllers/subscription.controller";
import { userController } from "../controllers/user.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { TokenEnum } from "../enums/token.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.get(
    "/",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_GET),
    userController.getMe,
);

router.patch(
    "/",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_UPDATE),
    userController.updateMe,
);

router.patch(
    "/close",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_DEACTIVATE),
    userController.closeMe,
);

router.patch(
    "/become-seller",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_BECOME_SELLER),
    userController.becomeSeller,
);
router.patch(
    "/upgrade-plan",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_UPGRADE_PLAN),
    subscriptionController.upgradeToPremium,
);
router.patch(
    "/top-up-balance",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_TOP_UP),
    userController.topUpBalance,
);

router.post(
    "/avatar",
    fileMiddleware.isValidFile("avatar"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_UPLOAD_AVATAR),
    userController.uploadAvatar,
);
router.delete(
    "/avatar",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.ME_DELETE_AVATAR),
    userController.deleteAvatar,
);

export const meRouter = router;
