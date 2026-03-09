import { Router } from "express";

import { commonMiddleware } from "../../../common/middlewares/common.middleware";
import { fileMiddleware } from "../../../common/middlewares/file.middleware";
import { authMiddleware } from "../../auth/auth.middleware";
import { TokenEnum } from "../../auth/enums/token.enum";
import { subscriptionController } from "../../subscription/subscription.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { userController } from "../user.controller";
import { UserValidator } from "../validators/user.validator";
import { WalletValidator } from "../validators/wallet.validator";

const router = Router();

router.use(
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
);

router.get(
    "/",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_GET,
        "You do not have permission to view this profile",
    ),
    userController.getMe,
);

router.patch(
    "/",
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_EDIT,
        "You do not have permission to edit your profile information",
    ),
    commonMiddleware.validateBody(UserValidator.updateMe),
    userController.updateMe,
);

router.patch(
    "/close",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_DEACTIVATE,
        "You do not have permission to deactivate this account",
    ),
    userController.closeMe,
);

router.patch(
    "/become-seller",
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_BECOME_SELLER,
        "You do not have permission to become a seller",
    ),
    userController.becomeSeller,
);

router.patch(
    "/upgrade-plan",
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_UPGRADE_PLAN,
        "You do not have permission to upgrade your subscription plan",
    ),
    subscriptionController.upgradeToPremium,
);

router.patch(
    "/top-up-balance",
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_TOP_UP,
        "You do not have permission to top up your balance",
    ),
    commonMiddleware.validateBody(WalletValidator.topUp),
    userController.topUpBalance,
);

router.post(
    "/avatar",
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_UPLOAD_AVATAR,
        "You do not have permission to upload an avatar",
    ),
    fileMiddleware.isValidFile("avatar"),
    userController.uploadAvatar,
);
router.delete(
    "/avatar",
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_DELETE_AVATAR,
        "You do not have permission to delete your avatar",
    ),
    userController.deleteAvatar,
);

export const meRouter = router;
