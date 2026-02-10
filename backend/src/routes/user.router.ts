import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", userController.getAll);

router.get(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    userController.getById,
);

router.patch(
    "/:userId/admin",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.updateByAdmin,
);

router.patch(
    "/:userId/activate",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.activateUser,
);

router.patch(
    "/:userId/deactivate",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.deactivateUser,
);

router.delete(
    "/:userId",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.deleteById,
);

export const userRouter = router;
