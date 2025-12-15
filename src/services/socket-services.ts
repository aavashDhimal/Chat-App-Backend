import { io } from "../app";
import UserModel from "../model/user-model";
import Room from "../model/room-model";
import Message from "../model/message-model";

const userSockets = new Map();

const getActiveUsers = async () => {
  const activeUsers = [];
  for (const [userId, socketId] of userSockets.entries()) {
    const user = await UserModel.findById(userId).select('_id name email');
    if (user) {
      activeUsers.push({ ...user.toObject(), isOnline: true });
    }
  }
  return activeUsers;
};



io.on('connection', (socket :any) => {
  
  userSockets.set(socket.userId, socket.id);
   socket.broadcast.emit('active-list', { users : Array.from(userSockets.keys())});
  
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
  
  socket.on('room:leave', async (roomId : string) => {
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
     const saved =  await message.save();
      await message.populate('sender', 'name');
      
      // // Update room's last message
      // await Room.findByIdAndUpdate(roomId, { lastMessage: message._id });
      
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
  
  socket.on('get-active-users', async (callback: any) => {
    try {
      const users = await getActiveUsers();
      callback({ success: true, data: users });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  


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
    console.log(`User disconnected: ${socket.userId}`);
    userSockets.delete(socket.userId);
    
    
    socket.broadcast.emit('active-list', { 
     users :  Array.from(userSockets.keys())
    });
  });
});