//========= BACKEND SERVER.JS ========//
import express, { urlencoded } from 'express';
import cors from 'cors';
import colors from 'colors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import connectDB from './utils/db.js';
import postRouter from './routes/post.route.js';
import messageRouter from './routes/message.route.js';

//========= CONGIGURE .ENV ========//
import dotenv from 'dotenv';
import AIrouter from './routes/ai.route.js';
dotenv.config();

//========= INITIALIZE SERVER ========//
const server = express();

//========= ALL MIDDLEWARES ========//
server.use(express.json());
server.use(urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use('/uploads', express.static('uploads'));

//========= CORS CONFIGURATION ========//
server.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

//========= ALL ROUTES ========//
server.use('/api/user', userRouter);
server.use('/api/post', postRouter);
server.use('/api/message', messageRouter);
server.use('/', AIrouter);


//========= SERVER LISTENS ========//
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port http://localhost:${PORT}`.rainbow.bold);
});