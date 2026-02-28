import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { TokenEnum } from "../enums/token.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();
router.get(
    "/",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_GET_ALL),
    userController.getAll,
);

router.get(
    "/moderation/:userId",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_GET_BY_MODERATION,
    ),
    userController.getByIdForModeration,
);

router.patch(
    "/moderation/:userId/role",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_SET_ROLE),
    userController.setPlatformRole,
);

router.patch(
    "/moderation/:userId/activate",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_ACTIVATE),
    userController.activate,
);

router.patch(
    "/moderation/:userId/deactivate",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_DEACTIVATE),
    userController.deactivate,
);

router.patch(
    "/moderation/:userId",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_EDIT_BY_MODERATION,
    ),
    userController.updateByRole,
);

router.delete(
    "/moderation/:userId",
    commonMiddleware.isValidId("userId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_DELETE),
    userController.deleteById,
);

router.get(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    userController.getPublicById,
);

export const userRouter = router;
