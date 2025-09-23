import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editLecture, getCourse, getCourseById, getCreatorCourses, getLectureById, getLectures, getPublishedCourse, mylearning, removeCourse, removeLecture, searchCourse, togglePublishCourse } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const router=express.Router();

//static routes
router.route("/").post(isAuthenticated,createCourse);
router.route("/search").get(isAuthenticated,searchCourse);
router.route("/published-courses").get(getPublishedCourse);
router.route("/").get(isAuthenticated,getCreatorCourses);
router.route("/my-learning").get(isAuthenticated,mylearning);

//dynamic routes must always be defined below staitc routes to ignore conflicts like
//if "/my-learning" would be definded below "/:courseId"  then my learning would have been considered like a dynamic route of "/:courseId"
//  and wrong controller would be called

router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").get(isAuthenticated,getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated,createLecture);
router.route("/:courseId/lecture").get(isAuthenticated,getLectures);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);
router.route("/:courseId").patch(isAuthenticated,togglePublishCourse);  //when minor changes use patch we used this since we had this route already defined
router.route("/remove/:courseId").delete(isAuthenticated,removeCourse);
router.route("/course/details/:courseId").get(isAuthenticated,getCourse);


export default router;