import path from "node:path";

import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../../../.env") });

type MainConfig = {
    PORT: string;
    MONGO_URI: string;
    DB_MAX_RETIRES: number;
};

export const mainConfig: MainConfig = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    DB_MAX_RETIRES: Number(process.env.DB_MAX_RETIRES),
};
