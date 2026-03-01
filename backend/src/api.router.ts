import { Router } from "express";

import { authRouter } from "./modules/auth/auth.router";
import { carRouter } from "./modules/car/car.router";
import { listingRouter } from "./modules/listing/listing.router";
import { subscriptionRouter } from "./modules/subscription/subscription.router";
import { meRouter } from "./modules/user/routes/me.router";
import { userRouter } from "./modules/user/routes/user.router";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/me", meRouter);
router.use("/listings", listingRouter);
router.use("/cars", carRouter);
router.use("/admin/subscriptions", subscriptionRouter);

export const apiRouter = router;
