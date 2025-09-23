import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js"

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and  category are required"
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        });
        return res.status(201).json({
            course,
            message: "Course Created"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}


export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(400).json({
                courses: [],
                message: "No Courses found"
            })
        }
        return res.status(200).json({
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}



export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }

        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];    //getting publicId from public url
                await deleteMediaFromCloudinary(publicId);                               //delete old image
            }
            //upload thumbnail from cloudinaryz
            courseThumbnail = await uploadMedia(thumbnail.path);
        }




        const updatedData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url }

        course = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

        return res.status(200).json({
            message: "Course Updated Succesfully",
            course
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update course"
        })
    }
}


export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course Not found"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by id"
        })
    }
}


export const getCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("creator lectures");
        //console.log(course);
        if (!course) {
            return res.status(404).json({
                message: "Course Not found"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by id"
        })
    }
}


export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;

        const { courseId } = req.params;


        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture Title  is required"
            })
        }

        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);

        if (course) {
            course.lectures.push(lecture._id);                     //adding lecture to course
            await course.save();
        }
        return res.status(201).json({
            lecture,
            message: "Lecture Created Successfully"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to         create lecture"
        })
    }
}


export const getLectures = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");      //replace lecturesObject id with lectures itself only for this course not the actual DB
        if (!course) {
            return res.status(404).json({
                message: "Course Not Found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture"
        })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        //console.log(videoInfo.publicId);
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture Not Found"
            })
        }
        //update lecture
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo) {
            if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
            if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;
        }

        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        //Ensure course still has lecture id if it was not added 
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id)
            await course.save();
        }
        return res.status(200).json({
            message: "Lecture updated Successfully "
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to  edit lecture"
        })
    }
}


export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }

        //delete the lecture from cloudinary

        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        //remove the lecture reference from course

        await Course.updateOne(
            {
                lectures: lectureId
            },                                    //find course that contains the lecture
            {
                $pull: { lectures: lectureId }       //removes the lectures id from lectures array
            }
        );
        return res.status(200).json({
            message: "Lecture Removed Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture"
        })
    }
}



export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }
        return res.status(200).json({
            lecture
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by Id"
        })
    }
}


export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;//true or false

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: " Course not found"
            })
        }


        if (publish) {
            course.isPublished = publish === "true";  // if true then isPublished becomes true else becomes false
        }

        const statusMessage = course.isPublished ? "Published" : "Unpublished"
        await course.save();

        return res.status(200).json({
            message: `Course is ${statusMessage}`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to Updata Status"
        })
    }
}


export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course Not Found"
            })
        }

        const lectures = course.lectures;


        for (const lecture of lectures) {         //map is not used here since sequential await is not maintained in map and this for 
            //maintains the seq
            if (lecture.publicId)
                await deleteVideoFromCloudinary(lecture.publicId);
            await Lecture.findByIdAndDelete(lecture._id);
        }

        //console.log(course.courseThumbnail.split("/").pop().split(".")[0]);

        const thumbnailPublicId = course.courseThumbnail?.split("/").pop().split(".")[0];
        if (thumbnailPublicId)
            await deleteMediaFromCloudinary(thumbnailPublicId);
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            message: "Course Removed Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove Course",
            sucess: false
        })
    }
}


export const getPublishedCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });//populate creator with creator.name and creator.photoUrl
        if (!courses) {
            return res.status(404).json({
                message: "No Course Found"
            })
        }
        return res.status(200).json({
            courses,
            message: "Published Courses"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get Published Courses",
            sucess: false
        })
    }
}


export const mylearning = async (req, res) => {
    try {
        const userId = req.id;
        const purchase = await CoursePurchase.find({ userId: userId, status: "completed" }).populate("courseId");

        if (!purchase) {
            return res.status(400).json({
                purchase: []
            })
        }

        console.log(purchase);

        // purchase =await Course.updateMany()
        //const course =await purchase.courseId;
        //console.log(course);
        return res.status(200).json({
            purchase
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get Purchased Courses",
            sucess: false
        })
    }
}


export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;

        console.log(categories);
        const searchCriteria = {
            isPublished: true,
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },          //if found in courseTitle or subtitle or category thats why or is used
                { subTitle: { $regex: query, $options: "i" } },             //regex and all is used to match 
                { category: { $regex: query, $options: "i" } }              //regex is string matching algo in mongodb 
            ]                                                           //options i means case insensitive there are more ways also
        }

        if (categories.length > 0) {
            searchCriteria.category = { $in: categories };
        }


        const sortOptions = {};

        if (sortByPrice === "low") {
            sortOptions.coursePrice = 1; //sort by price in ascending order
        }
        else if (sortByPrice === "high") {
            sortOptions.coursePrice = -1;//sort by price in descending order
        }

        let courses = await Course.find(searchCriteria).sort(sortOptions).populate({ path: "creator", select: "name phtoUrl" });

        return res.status(200).json({
            courses: courses || [],
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}



