import { Router } from "express";

import { carController } from "../controllers/car.controller";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/:make/models",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    carController.getModelsByMake,
);
router.get(
    "/makes",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    carController.getAllMakes,
);

export const carRouter = router;
