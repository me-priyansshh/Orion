//=========== ALL IMPORTS ==========//
import express from "express";
import { isAuthenticated } from "../middlewares/authMidd.js";
import { getMessagesController, sendMessageController } from "../controllers/message.controller.js";

const messageRouter = express.Router();

//============ SEND MESSAGES ============//
messageRouter.post('/send/:id',isAuthenticated, sendMessageController);

//============ GET MESSAGES ============//
messageRouter.get('/get/:id',isAuthenticated, getMessagesController);

export default messageRouter