import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js"
import coursePurchase from "./routes/coursePurchase.route.js"
import messageRoute from "./routes/messages.route.js"
import superAdminRoute from "./routes/superAdmin.route.js"
import Razorpay from "razorpay";
import courseProgressRoute from "./routes/courseProgress.route.js"
import http from 'http'
import { Server } from "socket.io";
import { Message } from "./models/messages.model.js";


dotenv.config(); //dotenv configuration for getting PORT and MONGO_URI from .env file

//call databse connection here
connectDB();

const app = express();//defines express application object 

const PORT = process.env.PORT || 3000;

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});



//Socket IO
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('sendMessage', async ({userId,message,courseId}) => {
    const newMessage=await Message.create({userId,message,courseId});
    const populatedMessage=await Message.findById(newMessage._id).populate("userId").populate("courseId");    
    io.emit('receiveMessage', populatedMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



//default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.urlencoded({ extended: true }));        //this is done for reading response from razorpay post url at api/v1/purchase/verification

//apis  endpoints
app.use("/api/v1/media",mediaRoute);
app.use("/api/v1/user",userRoute);//middleware  eg http://localhost:8080/api/v1/user/register here userRoute is register 
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/purchase",coursePurchase);
app.use("/api/v1/progress",courseProgressRoute);
app.use("/api/v1/message",messageRoute)        ;
app.use("/api/v1/superadmin",superAdminRoute);






/*app.get("/home",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"HEllo"
    })
})*/

server.listen(PORT, () => {
    console.log(`Server + Socket.IO listening at port ${PORT}`);
});

