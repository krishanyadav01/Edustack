import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from "../controllers/courseProgress.controller.js";



const router=express.Router();

router.route("/:courseId").get(isAuthenticated  ,getCourseProgress);
router.route("/:courseId/complete").post(isAuthenticated, markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated,markAsInCompleted);
router.route("/:courseId/:lectureId").post(isAuthenticated,updateLectureProgress);

export default router ;