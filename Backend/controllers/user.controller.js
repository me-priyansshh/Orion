import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cludinary.js';
import getDataUri from '../utils/datauri.js';
import redisClient from '../Services/redis.service.js'

//============ REGISTER CONTROLLER ===============//
export const registerController = async (req, res) => {
       try {
        
         //Parse user data from request body
         const { userName, email, password } = req.body;

            //Perform basic validation
            if (!userName || !email || !password) {
                return res.status(400).send({
                    message: "All fields are required"
                });
            }

            //Check if user already exists
            const existingUser = await User.findOne({ email });
            if(existingUser) {
                return res.status(409).send({
                    message: "User already exists"
                });
            }

            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            //Create new user
            const user = await User.create({
                userName,
                email,
                password: hashedPassword,
            });
            
            res.status(201).send({
                message: "User registered successfully",
                user,
            });

       } catch (error) {
        console.log(error);
         res.status(500).send({
            message: "Error registering user"
         });
 }
};


//============ LOGIN CONTROLLER ===============//
export const loginController = async (req, res) => {
    try {
        
        const { userName, password } = req.body;

        //Perform basic validation
        if (!userName || !password) {
            return res.status(400).send({
                message: "All fields are required"
            });
        };

        //Check if user exists
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        };

        //Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                message: "Invalid email or password"
            });
        };

        //Generate JWT token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        //Set cookie
         return res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24,
        }).json({
            message: "User logged in successfully",
            user,
            token,  
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error logging in user"
        });
    }
};


//============ LOGOUT CONTROLLER ===============//
export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token").status(200).send({
            message: "User logged out successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error logging out user"
        });
    }
};


//============ PROFILE CONTROLLER ===============//
export const getProfileController = async (req, res) => {
        try {

            const userId  = req.params.id;

            if (!userId) {
                return res.status(400).send({
                    message: "User id is required"
                });
            };

            const user = await User.findById(userId).select('-password')
            .populate({path: 'posts', options: {sort: {createdAt: -1}}})
            .populate({path: 'followers', select: 'userName profilePic'})
            .populate({path: 'following', select: 'userName profilePic'})
            .populate({path: 'bookmarks', options: {sort: {createdAt: -1}}});

            if (!user) {
                return res.status(404).send({
                    message: "User not found"
                });
            };

            res.status(200).send({
                message: "Profile fetched successfully",
                user,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Error getting profile"
            });
        }
};


//============ UPDATE PROFILE CONTROLLER ===============//
export const updateProfileController = async (req, res) => {
    try {  
      //All the params
      const  userId  = req.id;
      const { bio, userName } = req.body;
      const profilePic = req.file;

      let cloudResponse;

      if (profilePic) {
         const fileUri = getDataUri(profilePic);
         cloudResponse = await cloudinary.uploader.upload(fileUri, {
            resource_type: "image",
            timeout: 60000,
         }); 
      };

      const user = await User.findById(userId);

      if (!user){
        return res.status(404).send({
            message: "User not found"
        });
      };

      if(bio){
         user.bio = bio;
      };

      if(userName){
        user.userName = userName;
      }

      if(profilePic){
        user.profilePic = cloudResponse.secure_url;
      }

      await user.save();

      return res.status(200).send({
        message: "Profile updated successfully",
        user,
      });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error updating profile"
        });
    }
};


//============ SUGGESTED USERS CONTROLLER ===============//
export const getSuggestedUsers = async (req, res) => {
     try {
        
       const loggedInUserId = req.id;
       if(!loggedInUserId){
        return res.status(401).send({
            message: "User not authenticated"
        });
       };

       const cache = `${loggedInUserId}-suggestedUsers`;

       const cachedUsers = await redisClient.get(cache);
       if(cachedUsers){
          return res.status(200).send({
            message: "Suggested users fetched successfully from redis cache",
            users: JSON.parse(cachedUsers),
          });
       };

      const suggestedUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

      if(!suggestedUsers){
        return res.status(404).send({
            message: "No suggested users found"
        });
      };

      await redisClient.set(cache, JSON.stringify(suggestedUsers), 'EX', 200);

      return res.status(200).send({
        message: "Suggested users fetched successfully",
        users: suggestedUsers,
      });

     } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting suggested users"
        });
     }
}


//============ FOLLOW OR UNFOLLOW CONTROLLER ===============//
export const followOrUnfollowController = async (req, res) => {
     try {
        
     const loggedInUserId = req.id; //The one who will follow i mean admin
     const  userId  = req.params.id; //The one who will be followed

     if(loggedInUserId === userId){
        return res.status(400).send({
            message: "You cannot follow yourself"
        });
     }

     const user = await User.findById(loggedInUserId);
     const targetUser = await User.findById(userId);

        if(!user || !targetUser){
        return res.status(404).send({
            message: "User not found"
        });
     }

     const isFollowing = user.following.includes(userId);

     if(isFollowing){
        //Unfollow
        await Promise.all([
            User.updateOne({ _id: loggedInUserId }, { $pull: { following: userId } }),
            User.updateOne({ _id: userId }, { $pull: { followers: loggedInUserId } }),
        ]);

         return res.status(200).send({
            message: "Unfollowed successfully"
         });
     }else{
        //Follow
        await Promise.all([
            User.updateOne({ _id: loggedInUserId }, { $push: { following: userId } }),
            User.updateOne({ _id: userId }, { $push: { followers: loggedInUserId } }),
        ]);
        
         return res.status(200).send({
            message: "followed successfully"
         });
     }


     } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error following or unfollowing user"
        });
     }
}