import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

roomSchema.index({ members: 1 });
roomSchema.index({ createdAt: -1 });


  const Room =mongoose.model('room', roomSchema);
  export default Room