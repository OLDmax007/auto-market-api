import { Router } from "express";

import { commonMiddleware } from "../../../common/middlewares/common.middleware";
import { authMiddleware } from "../../auth/auth.middleware";
import { TokenEnum } from "../../auth/enums/token.enum";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { userController } from "../user.controller";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.use(
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
);

router.get(
    "/",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_GET_ALL_FOR_STAFF,
        "You do not have permission to view the user list",
    ),
    userController.getAll,
);

router.get(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_GET_BY_ID_FOR_STAFF,
        "You do not have permission to view this user's details",
    ),
    userController.getByIdForStaff,
);

router.patch(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_EDIT_BY_ADMIN,
        "You do not have permission to edit user information",
    ),
    commonMiddleware.validateBody(UserValidator.updateByAdmin),
    userController.updateByAdmin,
);

router.patch(
    "/:userId/role",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_SET_ROLE,
        "You do not have permission to change user roles",
    ),
    commonMiddleware.validateBody(UserValidator.setRole),
    userController.setPlatformRole,
);

router.patch(
    "/:userId/activate",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_ACTIVATE,
        "You do not have permission to activate users",
    ),
    userController.activate,
);

router.patch(
    "/:userId/deactivate",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_DEACTIVATE,
        "You do not have permission to deactivate users",
    ),
    userController.deactivate,
);

router.delete(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.USER_DELETE,
        "You do not have permission to delete users",
    ),
    userController.deleteById,
);

export const staffUserRouter = router;
