import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
}, { timestamps: true });

export const Post = mongoose.model('post', postSchema);

export default Post;