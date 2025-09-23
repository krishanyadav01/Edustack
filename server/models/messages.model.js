import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    message:{
        type:String
    }
},{timestamps:true});

export const Message=mongoose.model("Message",messageSchema);