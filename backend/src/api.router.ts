import { Router } from "express";

import { authRouter } from "./modules/auth/auth.router";
import { carRouter } from "./modules/car/car.router";
import { listingRouter } from "./modules/listing/routes/listing.router";
import { staffListingRouter } from "./modules/listing/routes/staff-listing.router";
import { staffSubscriptionRouter } from "./modules/subscription/staff-subscription.router";
import { meRouter } from "./modules/user/routes/me.router";
import { staffUserRouter } from "./modules/user/routes/staff-user.router";
import { userRouter } from "./modules/user/routes/user.router";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/me", meRouter);
router.use("/listings", listingRouter);
router.use("/cars", carRouter);

router.use("/staff/users", staffUserRouter);
router.use("/staff/listings", staffListingRouter);
router.use("/staff/subscriptions", staffSubscriptionRouter);

export const apiRouter = router;
