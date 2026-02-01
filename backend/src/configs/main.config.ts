import path from "node:path";

import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../../../.env") });

type MainConfig = {
    PORT: string;
    MONGO_URI: string;
    DB_MAX_RETIRES: number;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_LIFETIME: any;
    JWT_REFRESH_LIFETIME: any;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
};

export const mainConfig: MainConfig = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    DB_MAX_RETIRES: Number(process.env.DB_MAX_RETIRES),
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_LIFETIME: process.env.JWT_ACCESS_LIFETIME,
    JWT_REFRESH_LIFETIME: process.env.JWT_REFRESH_LIFETIME,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
