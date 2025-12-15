import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  sender : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user',
    required : true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

messageSchema.index({ room: 1, createdAt: -1 });

const Message =  mongoose.model('Message', messageSchema);
export default Message