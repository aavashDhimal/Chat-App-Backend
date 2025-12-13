import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export interface AuthSocket extends Socket {
    userId?: string;
}

export const socketAuthMiddleware = (socket: AuthSocket, next: any) => {
    try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error("No token provided"));
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        socket.userId = decoded.id;
        next();
    } catch (error: any) {
        return next(new Error("Invalid token"));
    }
};
