import { Router } from "express";
import { getRooms, createRoom, getMessages } from "../controller/chat-controllers";
import { authMiddleware } from "../middleware/auth-middleware";

const router = Router();

router.get("/rooms", authMiddleware, getRooms);
router.post("/rooms", authMiddleware, createRoom);
router.get("/rooms/:roomId/messages", authMiddleware, getMessages);

export default router;
