import { Express } from "express";
import * as dotenv from "dotenv";

import logger from "../utils/logger";
import itemsRouter from "../routes/items";
import authRouter from "../routes/auth";
import protectedRouter from "../routes/protected";

export function startWebServer(): void {
    const app: Express = require("express")();
    const bodyParser = require("body-parser");
    const cors = require('cors');

    dotenv.config();

    const PORT = process.env.NODE_DOCKER_PORT || 8080;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Apply CORS middleware before routes
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173']
    };
    app.use(cors(corsOptions)); 

    app.use("/api", itemsRouter);
    app.use("/api/auth", authRouter);
    app.use("/api", protectedRouter);


    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}.`);
    });
}

// Not implemented yet
export function stopWebserver(): void {
    logger.info('stopWebserver');
}