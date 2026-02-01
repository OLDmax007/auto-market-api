import "./models/index";

import express, { NextFunction, Request, Response } from "express";

import { mainConfig } from "./configs/main.config";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/api.error";
import { apiRouter } from "./routes/api.router";
import { dataBaseService } from "./services/database.service";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", apiRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Unknown error";
    res.status(status).json({ message, status });
});

const startServer = async () => {
    try {
        const PORT = mainConfig.PORT;
        await dataBaseService.connectToDB();
        app.listen(PORT, () => {
            cronRunner();
            console.log(`Server is starting on the port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
};

startServer();
