import { Request, Response } from "express";
import * as chatServices from "../services/chat-services";

interface AuthRequest extends Request {
    userId?: string;
}

export const getRooms = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const rooms = await chatServices.getRoomsByUser(userId);
        res.json(rooms);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, members } = req.body;
        if (!name || !Array.isArray(members)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const room = await chatServices.createRoom(name, members, userId);
        res.status(201).json(room);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { roomId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const messages = await chatServices.getMessagesByRoom(roomId, page, limit);
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};