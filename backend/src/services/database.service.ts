import * as mongoose from "mongoose";

import { mainConfig } from "../configs/main.config";

class DataBaseService {
    async connectToDataBase(): Promise<void> {
        let retries = 0;
        const max_retries = mainConfig.DB_MAX_RETIRES;
        while (retries < max_retries) {
            const calcRetiresStr = `(${retries + 1}/${max_retries})`;
            try {
                console.log(`Connecting to the database... ${calcRetiresStr}.`);
                await mongoose.connect(mainConfig.MONGO_URI);
                console.log("Connection successfully");
                return;
            } catch (error) {
                retries++;
                console.error(`Connection failed ${calcRetiresStr}`);
                console.error("Error message:", error.message || error);
                if (retries === max_retries) {
                    console.log(
                        `All connection attempts failed ${calcRetiresStr}.`,
                    );
                    process.exit(1);
                }
                await this.toSleep(5000);
            }
        }
    }
    async toSleep(ms: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const dataBaseService = new DataBaseService();
