import express from "express";

import { mainConfig } from "./configs/main.config";
import { dataBaseService } from "./services/database.service";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startServer = async () => {
    try {
        const PORT = mainConfig.PORT;
        await dataBaseService.connectToDB();
        app.listen(PORT, () => {
            console.log(`Server is starting on the port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
};

startServer();
