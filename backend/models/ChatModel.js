import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
        messageCount:{
            type:Number,
            default:0
        }
    },
    {
        timestamps: true,
    }
);

const ChatModel = mongoose.model('Chat', ChatSchema); 
export default ChatModel;
