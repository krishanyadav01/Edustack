import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { deletePdfFromCloudinary, uploadPdf } from "../utils/cloudinary.js";
import { Request } from "../models/request.model.js";



export const getSuperAdminDashboard = async (req, res) => {
    try {
        const courses = await Course.find();
        const users = await User.find({ role: "student" });
        const instructors = await User.find({ role: "instructor" });

        let revenue = 0;
        courses.map((course) => {
            revenue = revenue + (course?.enrolledStudent.length * course?.coursePrice);
        })
        return res.status(200).json({
            success: true,
            data: {
                revenue,
                totalcourses: courses.length,
                users,
                instructors
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get All Courses",
            sucess: false
        })
    }
}



export const createReq = async (req, res) => {
    try {
        const { education, experience } = req.body;

        if (education == "" || experience == "") {
            return res.status(400).json({
                success: false,
                message: "Education & Experience Required"
            })
        }
        const resume = req.file;
        if (!resume) {
            return res.status(400).json({
                success: false,
                message: "Resume is required"
            })
        }
        let insResume = await uploadPdf(resume.path, resume.originalname);


        //console.log(insResume);

        if (!insResume) {
            return res.status(400).json({
                success: false,
                message: "Problem Uploading Resume"
            })
        }


        const request = await Request.create({
            userId: req.id,
            education,
            yoe: experience,
            resume: insResume.secure_url,
            rejectedMsg: ""
        })
        //console.log(request);
        return res.status(200).json({
            success: true,
            message: "Request Sent"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to Send Request",
            sucess: false
        })
    }
}



export const getPendingRequests = async (req, res) => {

    try {
        const requests = await Request.find({ status: "underreview" }).populate("userId");
        return res.status(200).json({
            success: true,
            requests
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to Get Requests",
            success: false
        })
    }

}


export const getRequestStatus = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(404).json({
                message: "Login First",
                success: false
            })
        }
        let request = await Request.find({ userId });
        // console.log(request);
        if(!request){
            request=[] ;
        }
        return res.status(200).json({
            success: true,
            request
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to Get Request Status",
            success: false
        })
    }
}

export const roleChange = async (req, res) => {
    try {
            const userId=req.id;
            const user=await User.findByIdAndUpdate(userId,{role:"instructor"});
            // console.log(user.role);
            return res.status(200).json({
                success:true,
                message:"You are Now an Instructor"
            }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Update Role"
        })
    }
}


export const getRequestById=async(req,res)=>{
    try {
        // console.log("Hello")
        const {reqId}=req.params ;
        const request=await Request.findById(reqId).populate("userId");
        if(!request){
            return res.status(400).json({
                success:false,
                message:"No Pending Request of this Id found"
            })
        }

        return res.status(200).json({
            success:true,
            request
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Get Request By Id"
        })
    }
}



export const rejectRequest=async(req,res)=>{
    try {
        const {reqId, msg}=req.body;
      
        const request=await Request.findByIdAndUpdate(reqId,{status:"rejected",rejectedMsg:msg});


        if(!request){
            return res.status(400).json({
                success:false,
                message:"Failed to get Request"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Application Rejected"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Update Request Application"
        })
    }
}

export const acceptRequest=async(req,res)=>{
    try {
        const {reqId}=req.body;
        
        const request=await Request.findByIdAndUpdate(reqId,{status:"accepted"});

        // console.log(request);
        if(!request){
            return res.status(400).json({
                success:false,
                message:"Failed to get Request"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Application Rejected"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Update Request Application"
        })
    }
}


export const deleteRequest =async(req,res)=>{
    try {
        const userId=req.id;
        const request=await Request.findOneAndDelete({userId});
        // console.log(request);
        if(!request){
            return res.status(400).json({
                success:false,
                message:"Failed to Create New Request"
            })
        }


        console.log(request.resume);

           let publicId = request.resume.split("/").pop();    //getting publicId from public url
          
           
        console.log(publicId) ;
        await deletePdfFromCloudinary(publicId);
        return res.status(200).json({
            success:true 
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Create New Request"
        })
    }
}