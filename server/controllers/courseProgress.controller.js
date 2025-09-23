import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js"

export const getCourseProgress = async (req, res) => {
    try {

        const { courseId } = req.params;
        const userId = req.id;

        //fetch user course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if (!courseDetails) {
            return res.status(404).json({
                message: "Course Not Found"
            })
        }

        //if no progress is found return courseDetails with an empty progress
        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            })
        }

        //return course Progress
        return res.status(200).json({
            data: {
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({ courseId, userId });


        //if no progress exists create a new record
        if (!courseProgress) {
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            })
        }

        //find the lecture progress in course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);
        if (lectureIndex !== -1) {//if present
            //if lecture  already exists update status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }
        else {
            //add new lecture Progress to course Progress
            courseProgress.lectureProgress.push({
                lectureId, viewed: true
            })
        }

        //if all lecture is completed
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;//returns length of lecture progress array whos viewed=true
        const course = await Course.findById(courseId);
        if (course.lectures.length === lectureProgressLength) {  //if all the lectures are completed mark course is completed
            courseProgress.completed = true;
        }
        await courseProgress.save();

        return res.status(200).json({
            message: "Lecture Progress updated Successfully"
        })
    } catch (error) {
        console.log(error);
    }
}


export const markAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            return res.status(404).json({
                message: "Atleast finish One Video to mark completed"
            })
        }

        console.log(courseId);
        const course=await Course.findById(courseId);
        
        
        const lectures=course.lectures; 


        courseProgress.lectureProgress=lectures?.map((lecture)=>({
            lectureId:lecture._id,
            viewed:true
        }));

        //courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed=true);

        courseProgress.completed=true;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as completed"
        })
    } catch (error) {
        console.log(error);
    }
}

export const markAsInCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            return res.status(404).json({
                message: "Course Progress Not found"
            })
        }
        courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed=false);
        courseProgress.completed=false;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as Incomplete"
        })
    } catch (error) {
        console.log(error);
    }
}