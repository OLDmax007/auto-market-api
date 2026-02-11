import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.getMe,
);
router.patch(
    "/",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userController.updateMe,
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

export const meRouter = router;
