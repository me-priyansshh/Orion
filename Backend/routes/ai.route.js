import express from 'express';
import { chatController, clearRagController, generateImageController, pdfChatController, ragController } from '../controllers/ai.controller.js';
import upload from '../middlewares/multer.js';

const AIrouter = express(); 

AIrouter.post('/AI', chatController);

AIrouter.post('/ai/image', generateImageController);

AIrouter.post('/rag/pdf', upload.single('file'), ragController);

AIrouter.post('/pdf/chat', pdfChatController);

AIrouter.delete('/rag/clear', clearRagController);

export default AIrouter;