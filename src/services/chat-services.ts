import Room from "../model/room-model";
import Message from "../model/message-model";
import UserModel from "../model/user-model";
import mongoose from "mongoose";

export const getRoomsByUser = async (userId: string) => {
const userObjectId = new mongoose.Types.ObjectId(userId);

const rooms = await Room.aggregate([
  {
    $match: {
      members: userObjectId
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "members",
      foreignField: "_id",
      as: "members"
    }
  },
  {
    $addFields: {
      otherUser: {
        $first: {
          $filter: {
            input: "$members",
            as: "member",
            cond: {
              $ne: ["$$member._id", userObjectId]
            }
          }
        }
      }
    }
  },
  {
    $project: {
      _id: 1,
      name: "$otherUser.name",
      reciverId: "$otherUser._id"
    }
  }
]);

return rooms;
};

export const getRoom = async (members: string[]) => {
    const room = await Room.findOne({
        members: { $all: members, $size: members.length }
    }).exec();
    
    return room;
}
export const getUsers = async (userId: string) => {
    const users = await UserModel.find(
        { _id: { $ne: userId } },
        { _id: 1, name: 1 }
    ).exec()

    return users;
};

export const createRoom = async ( members: string[], userId: string) => {
    const room = new Room({
        members: [...members],
        createdBy: userId
    });
    await room.save();
    // await room.populate('members', 'username email');
    return room;
};

export const getMessagesByRoom = async (
    roomId: string,
    page: number = 1,
    limit: number = 50
) => {
    const messages = await Message.find({ room: roomId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
    return messages.reverse();
};


