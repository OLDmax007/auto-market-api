import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", userController.getAll);
router.get(
    "/:userId",
    commonMiddleware.isValidId("userId"),
    userController.getById,
);

export const userRouter = router;
