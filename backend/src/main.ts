import "./index-models";

import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";

import { apiRouter } from "./api.router";
import { mainConfig } from "./common/configs/main.config";
import { ApiError } from "./common/errors/api.error";
import { dataBaseService } from "./common/services/database.service";
import { swaggerDocument } from "./docs/swagger/swagger";
import { cronRunner } from "./index-crons";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", apiRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Unknown error";
    res.status(status).json({ message, status });
});

const startServer = async () => {
    try {
        const { PORT, BACKEND_URL } = mainConfig;
        await dataBaseService.connectToDB();
        app.listen(PORT, () => {
            cronRunner();
            console.log(`Server is starting on the port ${PORT}`);
            console.log(`API docs: ${BACKEND_URL}/docs`);
        });
    } catch (e) {
        console.error(e);
    }
};

void startServer();
