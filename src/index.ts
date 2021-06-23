import { Server } from "@abhik017/ecom-express-server";
import routes = require("./api/routes/routes");
import { Express } from "express";
require("dotenv").config();
export class ServerService {
    getServer() {
        return new Server((app: Express) => routes.routes(app), process.env.MONGODB_CONNECT as string);
    }

    async startServer() {
        const server = this.getServer();
        await server.launchServer();
    }
}

const serverService = new ServerService();

serverService.startServer().catch(err => console.log("Failed to start service" + err.toString()));