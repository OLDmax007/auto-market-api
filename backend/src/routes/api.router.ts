import { Router } from "express";

import { authRouter } from "./auth.router";
import { carRouter } from "./car.router";
import { listingRouter } from "./listing.router";
import { meRouter } from "./me.router";
import { userRouter } from "./user.router";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/me", meRouter);
router.use("/listings", listingRouter);
router.use("/cars", carRouter);

export const apiRouter = router;
