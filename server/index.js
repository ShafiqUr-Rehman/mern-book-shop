import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './mongodb-connection.js';
import { userRouter } from './routes/userRouter.js'; 
import { adminRouter } from './routes/adminRoute.js';
import { bookRouter } from './routes/bookRouter.js';

dotenv.config(); 

const app = express(); 

app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/book', bookRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
