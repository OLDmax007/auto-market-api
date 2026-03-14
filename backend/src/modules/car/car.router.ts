import { Router } from "express";

import { commonMiddleware } from "../../common/middlewares/common.middleware";
import { authMiddleware } from "../auth/auth.middleware";
import { TokenEnum } from "../auth/enums/token.enum";
import { PlatformPermissionEnum } from "../user/enums/platform-permission.enum";
import { roleMiddleware } from "../user/middlewares/role.middleware";
import { userMiddleware } from "../user/middlewares/user.middleware";
import { carController } from "./car.controller";
import { CarValidator } from "./car.validator";

const router = Router();

router.get("/makes", carController.getAllMakes);
router.get(
    "/:make/models",
    commonMiddleware.validateParams(CarValidator.makeParam),
    carController.getModelsByMake,
);

router.use(
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
);

router.post(
    "/missing-report/make",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.CAR_MISSING_REPORT,
        "You don't have permission to suggest new make",
    ),
    commonMiddleware.validateBody(CarValidator.sendMissingMake),
    carController.reportMissingMake,
);

router.post(
    "/missing-report/model",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.CAR_MISSING_REPORT,
        "You don't have permission to suggest new model",
    ),
    commonMiddleware.validateBody(CarValidator.sendMissingModel),
    carController.reportMissingModel,
);

export const carRouter = router;
