import {app, io} from "./app";
import { connectDB } from "./config/db";
import "./swagger";
import "./services/socket-services";
import http from "http";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const httpServer = http.createServer(app);

io.attach(httpServer);

httpServer.listen(process.env.SERVER_PORT, () => {
    console.log("HTTP Server listening on port 4040");
});

io.on("connection", () => {
    console.log("Socket.io server ready");
});

