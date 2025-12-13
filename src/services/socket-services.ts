import { io } from "../app";
import UserModel from "../model/user-model";
import Room from "../model/room-model";
import Message from "../model/message-model";

const userSockets = new Map();

io.on('connection', (socket :any) => {
  console.log(`User connected: ${socket.username}`);
  
  userSockets.set(socket.userId, socket.id);
  
  socket.broadcast.emit('UserModel:online', { userId: socket.userId, username: socket.username });
  
  socket.on('room:join', async (roomId : string) => {
    try {
      const room = await Room.findById(roomId);
      if (!room ) {
        return socket.emit('error', { message: 'Access denied' });
      }
      
      socket.join(roomId);
      socket.currentRoom = roomId;
      socket.emit('room:joined', { roomId });
    } catch (error : any) {
      socket.emit('error', { message: error.message });
    }
  });
  
  socket.on('room:leave', (roomId : string) => {
    socket.leave(roomId);
    socket.currentRoom = null;
  });
  
  socket.on('message:send', async (data : any) => {
    try {
      const { roomId, content, type = 'text' } = data;
      
      const message = new Message({
        room: roomId,
        sender: socket.userId,
        content,
        type
      });
      await message.save();
      await message.populate('sender', 'username');
      
      // Update room's last message
      await Room.findByIdAndUpdate(roomId, { lastMessage: message._id });
      
      // Emit to all users in the room
      io.to(roomId).emit('message:receive', message);
    } catch (error : any) {
      socket.emit('error', { message: error.message });
    }
  });
  
  socket.on('typing:start', ({ roomId } : {roomId : string}) => {
    socket.to(roomId).emit('typing:UserModel', { 
      userId: socket.userId, 
      username: socket.username,
      isTyping: true 
    });
  });
  
  socket.on('typing:stop', ({ roomId }:{roomId : string}) => {
    socket.to(roomId).emit('typing:UserModel', { 
      userId: socket.userId, 
      username: socket.username,
      isTyping: false 
    });
  });
  
  // Read receipt
  socket.on('message:read', async ({ messageId, roomId }:{roomId : string , messageId: string}) => {
    try {
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { readBy: socket.userId }
      });
      socket.to(roomId).emit('message:read', { messageId, userId: socket.userId });
    } catch (error : any) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // Disconnect
  socket.on('disconnect', async () => {
    console.log(`UserModel disconnected: ${socket.username}`);
    userSockets.delete(socket.userId);
    
    // Update UserModel status
    await UserModel.findByIdAndUpdate(socket.userId, { 
      isOnline: false,
      lastSeen: new Date()
    });
    
    socket.broadcast.emit('UserModel:offline', { 
      userId: socket.userId,
      lastSeen: new Date()
    });
  });
});