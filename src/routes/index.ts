import { Router } from "express";
import authRouter from "./auth-controller";
import chatRouter from "./chat-routes";

const router = Router();
router.use("/auth", authRouter);
router.use("/chat", chatRouter);

export default router;
