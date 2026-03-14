import { Router } from "express";

import { commonMiddleware } from "../../../common/middlewares/common.middleware";
import { authMiddleware } from "../../auth/auth.middleware";
import { TokenEnum } from "../../auth/enums/token.enum";
import { PlatformPermissionEnum } from "../../user/enums/platform-permission.enum";
import { roleMiddleware } from "../../user/middlewares/role.middleware";
import { userMiddleware } from "../../user/middlewares/user.middleware";
import { listingController } from "../listing.controller";
import { ListingValidator } from "../listing.validator";

const router = Router();

router.use(
    authMiddleware.checkToken(TokenEnum.ACCESS),
    userMiddleware.isActiveUser,
    userMiddleware.isVerifiedUser,
);

router.get(
    "/",
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_ALL_FOR_STAFF,
        "You do not have permission to view the full listings list",
    ),
    listingController.getAllByStaff,
);

router.patch(
    "/manager/:listingId",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_EDIT_BY_MANAGER,
        "You do not have permission to moderate listings",
    ),
    commonMiddleware.validateBody(ListingValidator.updateByManager),
    listingController.updateByManager,
);

router.get(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_GET_BY_ID_FOR_STAFF,
        "You do not have permission to view this listing's details",
    ),
    listingController.getByIdForStaff,
);

router.patch(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_EDIT_BY_ADMIN,
        "You do not have permission to edit this listing as administrator",
    ),
    commonMiddleware.validateBody(ListingValidator.updateByAdmin),
    listingController.updateByAdmin,
);

router.patch(
    "/:listingId/activate",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_ACTIVATE,
        "You do not have permission to activate listings",
    ),
    listingController.activate,
);

router.patch(
    "/:listingId/deactivate",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_DEACTIVATE,
        "You do not have permission to deactivate listings",
    ),
    listingController.deactivate,
);

router.delete(
    "/:listingId",
    commonMiddleware.isValidId("listingId"),
    roleMiddleware.checkPermission(
        PlatformPermissionEnum.LISTING_DELETE,
        "You do not have permission to delete listings",
    ),
    listingController.deleteById,
);

export const staffListingRouter = router;
