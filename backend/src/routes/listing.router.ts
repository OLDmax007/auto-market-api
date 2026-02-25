import { Router } from "express";

import { listingController } from "../controllers/listing.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.get("/", listingController.getAllPublic);
router.get(
    "/my",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    listingController.getAllMy,
);
router.get(
    "/my/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_BY_MODERATION,
    ),
    listingController.getMyById,
);

router.get(
    "/moderation",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_ALL_BY_MODERATION,
    ),
    listingController.getAllByModeration,
);

router.get(
    "/moderation/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_BY_MODERATION,
    ),
    listingController.getByIdForModeration,
);

router.get(
    "/:listingId/statistics",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_GET_STATS),
    listingController.getPremiumListingStats,
);

router.get(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS, true),
    listingController.getPublicById,
);

router.post(
    "/",
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_CREATE),
    listingController.create,
);

router.patch(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_EDIT),
    listingController.updateById,
);

router.patch(
    "/moderation/:listingId/activate",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_ACTIVATE),
    listingController.activateListing,
);

router.patch(
    "/moderation/:listingId/deactivate",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_DEACTIVATE),
    listingController.deactivateListing,
);
router.patch(
    "/:listingId/close",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_LISTING_DEACTIVATE,
    ),
    listingController.closeMyListing,
);

router.delete(
    "/moderation/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenTypeEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_DELETE),
    listingController.deleteById,
);

export const listingRouter = router;
