//=========== ALL IMPORTS ==========//
import sharp from "sharp";
import Post from "../models/postModel.js";
import cloudinary from "../utils/cludinary.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import getDataUri from "../utils/datauri.js";
import { upload } from "../middlewares/multer.js";
import redisClient from "../Services/redis.service.js";

//============ ADD POST CONTROLLER ===============//
export const addPostController = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;
    const authorId = req.id;

    if (!caption || !file) {
      return res.status(400).send({ message: "All fields are required" });
    }

    let fileUri;

    // Handle images
    if (file.mimetype.startsWith("image/")) {
      const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      fileUri = getDataUri({
        originalname: file.originalname,
        buffer: optimizedBuffer,
      });
    }
    // Handle videos
    else if (file.mimetype.startsWith("video/")) {
      fileUri = getDataUri(file);
    } else {
      return res.status(400).send({ message: "Unsupported file type" });
    }

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
      timeout: 200000,
    });

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      cloudinaryId: cloudResponse.public_id, 
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).send({
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error adding post" });
  }
};

//============ GET ALL POSTS CONTROLLER ===============//
export const getAllPostsController = async (req, res) => {
    try {
        
      const cache = 'all-posts';

      const cached = await redisClient.get(cache);
      if(cached){
          return res.status(200).send({
             message: 'Posts fetched successfully from redis cache',
             posts: JSON.parse(cached)
          })
      };

      const posts = await Post.find().sort({createdAt: -1})
      .populate({path: 'author', select: 'userName profilePic'})
      .populate({path: 'comments', sort: {createdAt: -1}, populate: {path: 'author', select: 'userName profilePic'}});

      await redisClient.set(cache, JSON.stringify(posts), 'EX', 200);

      return res.status(200).send({
        message: "Posts fetched successfully",
        posts: posts,
      });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting all posts"
        });
    }
};

//============ GET POST BY USER CONTROLLER ===============//
export const getPostByUserController = async (req, res) => {
    try {
        
      const authorId = req.params.id;

      const cachePost = `${authorId}-posts`;

      const cached = await redisClient.get(cachePost);
      if(cached){
        return res.status(200).send({
          message: "Posts fetched successfully from redis cache",
          posts: JSON.parse(cached),
        });
      };

      const post = await Post.find({author: authorId}).sort({createdAt: -1})
      .populate({path: 'author', select: 'userName profilePic'})
      .populate({path: 'comments', sort: {createdAt: -1}, populate: {path: 'author', select: 'userName profilePic'}});

      await redisClient.set(cachePost, JSON.stringify(post), 'EX', 200);

      return res.status(201).json({
        message: "Posts fetched successfully",
        posts: post,
      });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting posts by user"
        });
    }
};

//============ LIKE POST CONTROLLER ===============//
export const likePostController = async (req, res) => {
    try {
        
        const loggedInUserId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).send({
                message: "Post not found"
            });
        };

        await post.updateOne({ $addToSet: { likes: loggedInUserId }});

        //Implementation Of socket.io

        return res.status(200).send({
            message: "Post liked successfully",
            post,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error liking post"
        });
    }
};

//============ DISLIKE POST CONTROLLER ===============//
export const dislikePostController = async (req, res) => {
    try {
        
        const loggedInUserId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).send({
                message: "Post not found"
            });
        };

        await post.updateOne({ $pull: { likes: loggedInUserId }});

        //Implementation Of socket.io

        return res.status(200).send({
            message: "Post Disliked successfully",
            post,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error unliking post"
        });
    }
};

//============ ADD COMMENT CONTROLLER ===============//
export const addCommentController = async (req, res) => {
    try {
        
        const loggedInUserId = req.id;
        const postId = req.params.id;

        const { text } = req.body;

        if(!text){
            return res.status(400).send({
                message: "Comment text is required"
            });
        };

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).send({
                message: "Post not found"
            });
        };

        const comment = await Comment.create({
            text,
            author: loggedInUserId,
            post: postId,
        });

        comment.populate({path: 'author', select: 'userName profilePic'});

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).send({
            message: "Comment added successfully",
            comment,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error adding comment"
        });
    }
};

//============ GET ALL COMMENTS CONTROLLER ===============//
export const getAllCommentsController = async (req, res) => {
    try {

        const postId = req.params.id;

        const cache = `${postId}-comments`;

        const cached = await redisClient.get(cache);
        if(cached){
           return res.status(200).send({
            message: "Comments fetched successfully from redis cache",
            comments: JSON.parse(cached),
           });
        }

        const comments = await Comment.find({post: postId}).populate({path: 'author', select: 'userName profilePic'});

        if(!comments){
            return res.status(404).send({
                message: "No comments found on this post"
            });
        };

        await redisClient.set(cache, JSON.stringify(comments), 'EX', 200);

        return res.status(200).send({
            message: "Comments fetched successfully",
            comments,
        })
         
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting all comments"
        });
    }
};

//============ DELETE POST CONTROLLER ===============//
export const deletePostController = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).send({ message: "You are not authorized to delete this post" });
    }

    // Delete post from DB
    await Post.findByIdAndDelete(postId);

    // Delete from Cloudinary (handle image/video)
    if (post.cloudinaryId) { // if you stored public_id
      await cloudinary.uploader.destroy(post.cloudinaryId, {
        resource_type: post.image.endsWith(".mp4") ? "video" : "image",
      });
    }

    // Remove from user's posts array
    const user = await User.findById(authorId);
    if (user) {
      user.posts.pull(postId);
      await user.save();
    }

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error deleting post" });
  }
};

//============ BOOKMARK POST CONTROLLER ===============//
export const bookmarkPostController = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const user = await User.findById(userId);

    // Toggle bookmark
    if (user.bookmarks.includes(post._id)) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== post._id.toString()
      );
      await user.save();
    } else {
      user.bookmarks.push(post._id);
      await user.save();
    }

    // ✅ Populate all bookmarks (each post with image, likes, etc.)
    const populatedUser = await User.findById(userId)
      .populate({
        path: "bookmarks",
        populate: {
          path: "author", // only if Post has an author field
          select: "username profilePicture",
        },
        select: "image caption likes createdAt", // choose post fields
      })
      .select("-password"); // hide password

    return res.status(200).send({
      message: user.bookmarks.includes(post._id)
        ? "Post bookmarked successfully"
        : "Post unbookmarked successfully",
      user: populatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error bookmarking post" });
  }
};





