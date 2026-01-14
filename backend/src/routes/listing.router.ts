import { Router } from "express";

import { listingController } from "../controllers/listing.controller";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", listingController.getAll);
router.get(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    listingController.getById,
);

router.post(
    "/",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    listingController.create,
);

router.patch(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    listingController.updateById,
);

router.delete(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    listingController.deleteById,
);

export const listingRouter = router;
