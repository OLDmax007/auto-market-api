import { Router } from "express";

import { commonMiddleware } from "../../../common/middlewares/common.middleware";
import { userController } from "../user.controller";

const router = Router();

router.get(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    userController.getPublicById,
);

export const userRouter = router;
