import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    }],
}, { timestamps: true });

export const Chat = mongoose.model('chat', chatSchema);

export default Chat;