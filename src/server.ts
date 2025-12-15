import {app, io} from "./app";
import { connectDB } from "./config/db";
import "./swagger";
import "./services/socket-services";
import http from "http";

connectDB();

const httpServer = http.createServer(app);

// Attach socket.io to HTTP server
io.attach(httpServer);

// Start HTTP server
httpServer.listen(4040, () => {
    console.log("HTTP Server listening on port 4040");
});

// Socket.io is running on the same server
io.on("connection", () => {
    console.log("Socket.io server ready");
});

