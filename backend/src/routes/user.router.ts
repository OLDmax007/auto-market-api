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
    "/become-seller",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.becomeSeller,
);

router.patch(
    "/upgrade-plan",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.upgradeToPremium,
);

router.patch(
    "/top-up-balance",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.topUpBalance,
);
export const userRouter = router;
