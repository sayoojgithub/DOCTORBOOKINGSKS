import ChatModel from "../models/ChatModel.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const createChat = async (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  try {
    const existingChat = await ChatModel.findOne({
      members: {
        $all: [senderId, receiverId],
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }
    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const findUser = async (req, res) => {
  try {
    const userDetails = await User.findOne({ _id: req.body.userId });
    const doctorDetails = await Doctor.findOne({
      _id: req.body.userId,
    });

    // Handle the case where no user or electrician is found
    if (!userDetails && !doctorDetails) {
      return res.status(404).json({ message: "User or doctor not found" });
    }

    // If user details are found, include them in the response
    if (userDetails) {
      return res.status(200).json({ userDetails });
    }

    // If doctor details are found, include them in the response
    return res.status(200).json({ doctorDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
export const updateLastSeen = async (req,res)=>{
  const { userId, lastSeenTime } = req.body
  console.log('userId:',userId,lastSeenTime)
  try { 
    
    const user = await User.findById(userId)
    const doctor = await Doctor.findById(userId)
    if(user){
      await User.findByIdAndUpdate(userId,{$set:{lastSeen:lastSeenTime}},{new:true})
    }
    if(Doctor){
      await Doctor.findByIdAndUpdate(userId,{$set:{lastSeen:lastSeenTime}},{new:true})
    }

    return res.status(200).json({
      success: true,
      message: "last seen updated",
      
    });

  } catch (error) {
    return res.status(500).json({ message: "last seen updation failed" });
  }
}
