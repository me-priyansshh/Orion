//=========== ALL IMPORTS ==========//
import express from 'express';
import { addCommentController, addPostController, bookmarkPostController, deletePostController, dislikePostController, getAllCommentsController, getAllPostsController, getPostByUserController, likePostController } from '../controllers/post.controller.js';
import { isAuthenticated } from '../middlewares/authMidd.js';
import upload from '../middlewares/multer.js';

//=========== OBJECT ROUTER ==========//
const postRouter = express.Router();

//========== CREATE POST ============//
postRouter.post('/addPost',isAuthenticated,upload.single('file'), addPostController);

//========== DELETE POST ============//
postRouter.delete('/deletePost/:id',isAuthenticated, deletePostController);

//========== GET ALL POST ============//
postRouter.get('/getAllPosts',isAuthenticated, getAllPostsController);

//========== GET POST BY USER ============//
postRouter.get('/getPostByUser/:id',isAuthenticated, getPostByUserController);

//========== LIKE POST ============//
postRouter.put('/unlike/:id',isAuthenticated, likePostController);

//========== DISLIKE POST ============//
postRouter.put('/like/:id',isAuthenticated, dislikePostController);

//========== ADD COMMENT ON POST ============//
postRouter.post('/addComment/:id',isAuthenticated, addCommentController);

//========== GET ALL COMMENTS ON POST ============//
postRouter.get('/getAllComments/:id',isAuthenticated, getAllCommentsController);

//========== BOOKMARK POST ============//
postRouter.put('/bookmarkPost/:id',isAuthenticated, bookmarkPostController);

export default postRouter;