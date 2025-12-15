import express from "express";
import router from "./routes/index";
import cors from 'cors';
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/socket-middleware";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Socket.io instance (will be attached to HTTP server in server.ts)
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket middleware
io.use(socketAuthMiddleware);

app.use(cors());
app.use(express.json());
app.use(router);

export { app, io };
