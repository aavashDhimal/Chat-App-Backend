import express from "express";
import router from "./routes/index";
import cors from 'cors';
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/socket-middleware";


const io = new Server(4051)
const app = express();

// Socket middleware
io.use(socketAuthMiddleware);

app.use(cors());
app.use(express.json());
app.use(router);

export  {app,io};
