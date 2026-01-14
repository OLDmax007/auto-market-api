import { Router } from "express";

import { authRouter } from "./auth.router";
import { listingRouter } from "./listing.router";
import { userRouter } from "./user.router";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/listings", listingRouter);

export const apiRouter = router;
