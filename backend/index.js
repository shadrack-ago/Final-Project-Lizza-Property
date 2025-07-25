import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import uploadRouter from './routes/upload.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to mongodb") })
    .catch((err)=>{
        console.log(err)
    })

const __dirname = path.resolve();

const app = express();

// CORS setup
app.use(cors({
    origin: [
        'http://localhost:5173', // Vite dev
        'https://final-project-lizza-property.vercel.app' // Vercel prod
    ],
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

const PORT = 3000;

app.listen( PORT, ()=>{
    console.log(`Server is running on ${PORT}!`)
})

app.use('/api/user',userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRouter);



app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
} )
