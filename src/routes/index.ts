import { Router } from "express";
import authRouter from "./auth-controller";

const router = Router();
router.use("/auth", authRouter);

export default router;
