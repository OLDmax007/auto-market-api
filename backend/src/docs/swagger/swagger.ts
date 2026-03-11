import { OpenAPIV3 } from "openapi-types";

import { mainConfig } from "../../common/configs/main.config";
import { authPaths } from "./paths/auth.paths";
import { carPaths } from "./paths/car.paths";
import { listingPaths } from "./paths/listing.paths";
import { mePaths } from "./paths/me.paths";
import { listingStaffPaths } from "./paths/staff-listing.paths";
import { subscriptionStaffPaths } from "./paths/staff-subscription.paths";
import { userStaffPaths } from "./paths/staff-user.paths";
import { userPaths } from "./paths/user.paths";
import { carSchema } from "./schemas/car.schema";
import { commonSchema } from "./schemas/common.schema";
import { listingSchema } from "./schemas/listing.schema";
import { subscriptionSchema } from "./schemas/subscription.schema";
import { userSchema } from "./schemas/user.schema";

export const swaggerDocument: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "Auto Market API",
        description: "Auto market docs",
        version: "1.0.0",
        contact: {
            name: "Backend Support",
            email: mainConfig.EMAIL_SUPPORT,
        },
    },
    servers: [
        {
            url: mainConfig.BACKEND_URL,
            description: "Local development server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Enter your access token",
            },
        },
        schemas: {
            ...userSchema,
            ...listingSchema,
            ...carSchema,
            ...subscriptionSchema,
            ...commonSchema,
        },
    },
    paths: {
        ...authPaths,
        ...userPaths,
        ...mePaths,
        ...carPaths,
        ...listingPaths,
        ...userStaffPaths,
        ...listingStaffPaths,
        ...subscriptionStaffPaths,
    },
    tags: [
        { name: "Auth", description: "Login, Registration and Tokens" },
        {
            name: "Me",
            description: "Current User actions",
        },
        { name: "Users", description: "Public profiles of other users" },
        { name: "Listings", description: "Ads management and search" },
        { name: "Car", description: "Car models and brands dictionary" },

        { name: "Staff - Users", description: "Staff: Management of users" },
        { name: "Staff - Listings", description: "Staff: Moderation of ads" },
        {
            name: "Staff - Subscriptions",
            description: "Staff: Billing and plans",
        },
    ],
};
