import Room from "../model/room-model";
import Message from "../model/message-model";

// Get all rooms for a user
export const getRoomsByUser = async (userId: string) => {
    const rooms = await Room.find({ members: userId })
        .populate('members', 'username email')
        .populate('lastMessage');
    return rooms;
};

// Create a new room
export const createRoom = async (name: string, members: string[], userId: string) => {
    const room = new Room({
        name,
        members: [...members, userId],
        createdBy: userId
    });
    await room.save();
    await room.populate('members', 'username email');
    return room;
};

// Get messages for a room with pagination
export const getMessagesByRoom = async (
    roomId: string,
    page: number = 1,
    limit: number = 50
) => {
    const messages = await Message.find({ room: roomId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('sender', 'username');

    return messages.reverse();
};
