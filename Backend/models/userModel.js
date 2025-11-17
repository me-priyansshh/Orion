import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: null,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }],
}, { timestamps: true });

export const User = mongoose.model('user', userSchema);

export default User;