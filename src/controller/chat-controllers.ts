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

        const {  members } = req.body;
        if ( !Array.isArray(members)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        const roomExists = await chatServices.getRoom(members);
        if(roomExists){
            return  res.status(200).json(roomExists);
        }
        const room = await chatServices.createRoom( members, userId);
        res.status(201).json(room);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const roomId= req.params.roomId as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const messages = await chatServices.getMessagesByRoom(roomId, page, limit);
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const users = await chatServices.getUsers(userId);
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};