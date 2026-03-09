import path from "node:path";

import { ObjectCannedACL } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../../../../.env") });
type MainConfig = {
    FRONTEND_URL: string;
    HOST: string;
    PORT: string;
    MONGO_URI: string;
    DB_MAX_RETIRES: number;
    MAX_SESSIONS: number;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_LIFETIME: any;
    JWT_REFRESH_LIFETIME: any;
    EMAIL_SUPPORT: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    JWT_VERIFY_SECRET: string;
    JWT_VERIFY_LIFETIME: string;
    JWT_RECOVERY_SECRET: string;
    JWT_RECOVERY_LIFETIME: string;
    AWS_S3_BUCKET_NAME: string;
    AWS_S3_ACCESS_KEY: string;
    AWS_S3_SECRET_KEY: string;
    AWS_S3_REGION: string;
    AWS_S3_ACL: ObjectCannedACL;
    AWS_S3_BUCKET_URL: string;
    SEED_ADMIN_EMAIL: string;
    SEED_ADMIN_PASSWORD: string;
    SEED_ADMIN_FIRSTNAME: string;
    SEED_ADMIN_LASTNAME: string;
    SEED_ADMIN_AGE: number;
};

export const mainConfig: MainConfig = {
    FRONTEND_URL: process.env.FRONTEND_URL,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    DB_MAX_RETIRES: Number(process.env.DB_MAX_RETIRES),
    MAX_SESSIONS: Number(process.env.MAX_SESSIONS),
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_LIFETIME: process.env.JWT_ACCESS_LIFETIME,
    JWT_REFRESH_LIFETIME: process.env.JWT_REFRESH_LIFETIME,
    EMAIL_SUPPORT: process.env.EMAIL_SUPPORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    JWT_VERIFY_SECRET: process.env.JWT_VERIFY_SECRET,
    JWT_VERIFY_LIFETIME: process.env.JWT_VERIFY_LIFETIME,
    JWT_RECOVERY_SECRET: process.env.JWT_RECOVERY_SECRET,
    JWT_RECOVERY_LIFETIME: process.env.JWT_RECOVERY_LIFETIME,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_ACL: process.env.AWS_S3_ACL as ObjectCannedACL,
    AWS_S3_BUCKET_URL: process.env.AWS_S3_BUCKET_URL,
    SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
    SEED_ADMIN_FIRSTNAME: process.env.SEED_ADMIN_FIRSTNAME,
    SEED_ADMIN_LASTNAME: process.env.SEED_ADMIN_LASTNAME,
    SEED_ADMIN_AGE: Number(process.env.SEED_ADMIN_AGE),
};
