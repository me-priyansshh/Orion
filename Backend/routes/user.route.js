//========= ALL IMPORTS ========//
import express from 'express';
import { followOrUnfollowController, getProfileController, getSuggestedUsers, loginController, logoutController, registerController, updateProfileController } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/authMidd.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

//============== REGISTER USER ROUTE ==============//
userRouter.post('/register', registerController);

//============== LOGIN USER ==============//
userRouter.post('/login', loginController);

//============== LOGOUT USER ==============//
userRouter.get('/logout', isAuthenticated, logoutController);

//============== GET PROFILE ROUTE ==============//
userRouter.get('/profile/:id', isAuthenticated, getProfileController);

//============== UPDATE PROFILE ROUTE ==============
userRouter.put('/update', isAuthenticated, upload.single('profilePic'), updateProfileController);

//============== GET SUGGESTED ROUTE ==============//
userRouter.get('/suggested', isAuthenticated, getSuggestedUsers);

//============== FOLLOW OR UNFOLLOW ROUTE ==============//
userRouter.put('/follow/:id', isAuthenticated, followOrUnfollowController);

export default userRouter;