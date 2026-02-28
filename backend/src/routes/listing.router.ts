import { Router } from "express";

import { listingController } from "../controllers/listing.controller";
import { PlatformPermissionEnum } from "../enums/platform-permission.enum";
import { TokenEnum } from "../enums/token.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.get("/", listingController.getAllPublic);
router.get(
    "/my",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    listingController.getAllMy,
);
router.get(
    "/my/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_GET_MY_BY_ID),
    listingController.getMyById,
);

router.get(
    "/moderation",
    authMiddleware.checkToken(TokenEnum.ACCESS),
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
    authMiddleware.checkToken(TokenEnum.ACCESS),
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
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_GET_STATS),
    listingController.getPremiumListingStats,
);

router.get(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS, true),
    listingController.getPublicById,
);

router.post(
    "/",
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_CREATE),
    listingController.create,
);

router.patch(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_EDIT),
    listingController.updateById,
);

router.patch(
    "/moderation/:listingId/activate",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_ACTIVATE),
    listingController.activate,
);

router.patch(
    "/moderation/:listingId/deactivate",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_DEACTIVATE),
    listingController.deactivate,
);
router.patch(
    "/:listingId/close",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_LISTING_DEACTIVATE,
    ),
    listingController.closeMyListing,
);

router.post(
    "/:listingId/poster",
    commonMiddleware.isValidId("listingId"),
    fileMiddleware.isValidFile("poster"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_UPLOAD_POSTER,
    ),
    listingController.uploadPoster,
);
router.delete(
    "/:listingId/poster",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_DELETE_POSTER,
    ),
    listingController.deletePoster,
);

router.delete(
    "/moderation/:listingId",
    commonMiddleware.isValidId("listingId"),
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
    roleMiddleware.checkPermission(PlatformPermissionEnum.LISTING_DELETE),
    listingController.deleteById,
);

export const listingRouter = router;
