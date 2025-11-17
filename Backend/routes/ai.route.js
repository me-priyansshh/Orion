import express from 'express';
import { chatController, generateImageController } from '../controllers/ai.controller.js';

const AIrouter = express(); 

AIrouter.post('/AI', chatController);

AIrouter.post('/ai/image', generateImageController);

export default AIrouter;