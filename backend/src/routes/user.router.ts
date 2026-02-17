import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();
// maybe only admin
router.get(
    "/",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_GET_ALL),
    userController.getAll,
);

router.get(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    userController.getById,
);

router.patch(
    "/:userId/admin",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_EDIT_BY_ADMIN),
    userController.updateByAdmin,
);

router.patch(
    "/:userId/activate",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_ACTIVATE),
    userController.activateUser,
);

router.patch(
    "/:userId/deactivate",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_DEACTIVATE),
    userController.deactivateUser,
);

router.delete(
    "/:userId",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.USER_DELETE),
    userController.deleteById,
);

export const userRouter = router;
