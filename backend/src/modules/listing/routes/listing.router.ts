import { Router } from "express";

import { commonMiddleware } from "../../../common/middlewares/common.middleware";
import { fileMiddleware } from "../../../common/middlewares/file.middleware";
import { authMiddleware } from "../../auth/auth.middleware";
import { TokenEnum } from "../../auth/enums/token.enum";
import { PlatformPermissionEnum } from "../../user/enums/platform-permission.enum";
import { roleMiddleware } from "../../user/middlewares/role.middleware";
import { userMiddleware } from "../../user/middlewares/user.middleware";
import { listingController } from "../listing.controller";
import { ListingValidator } from "../listing.validator";

const router = Router();

router.get("/public", listingController.getAllPublic);

router.get(
    "/public/:listingId",
    authMiddleware.checkToken(TokenEnum.ACCESS, true),
    commonMiddleware.isValidId("listingId"),
    listingController.getPublicById,
);

router.use(
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
);

router.get(
    "/my",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_MY_ALL,
        "You do not have permission to view your listings",
    ),
    listingController.getAllMy,
);

router.get(
    "/my/:listingId",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_MY,
        "You do not have permission to view this listing",
    ),
    listingController.getMyById,
);

router.post(
    "/",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_CREATE,
        "You do not have permission to create listings",
    ),
    commonMiddleware.validateBody(ListingValidator.create),
    listingController.create,
);

router.patch(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_EDIT,
        "You do not have permission to edit this listing",
    ),
    commonMiddleware.validateBody(ListingValidator.update),
    listingController.updateMyListing,
);

router.get(
    "/:listingId/statistics",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_STATS,
        "You do not have permission to view statistics for this listing",
    ),
    listingController.getPremiumListingStats,
);

router.patch(
    "/:listingId/close",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.ME_LISTING_DEACTIVATE,
        "You do not have permission to close this listing",
    ),
    listingController.closeMyListing,
);

router.post(
    "/:listingId/poster",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_UPLOAD_POSTER,
        "You do not have permission to upload poster for this listing",
    ),
    fileMiddleware.isValidFile("poster"),
    listingController.uploadPoster,
);

router.delete(
    "/:listingId/poster",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_DELETE_POSTER,
        "You do not have permission to delete poster from this listing",
    ),
    listingController.deletePoster,
);

export const listingRouter = router;
