import { Message } from "../models/messages.model.js";




export const getCourseMessage = async (req, res) => {
    try {
        const  courseId = req.params.courseId;
        const Messages = await Message.find({ courseId }).sort({timestamp:1}).populate("userId").populate("courseId");

        
        res.status(200).json({
            success: true,
            message: Messages
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Get Messages"
        })
    }
}

export const createMessages = async (req, res) => {
    try {
        const {courseId,userId,message}=req.body;
        const msg=await Message.create({
            courseId,
            userId,
            message
        })
        res.status(200).json({
            success:true,
            msg:msg
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Create Messages"
        })
    }
}

