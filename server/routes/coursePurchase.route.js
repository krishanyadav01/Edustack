import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkout, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus, paymentVerification } from "../controllers/coursePurchase.controller.js";


const router=express.Router();

router.route("/checkout").post(isAuthenticated,checkout);
router.route("/verification").post(isAuthenticated,paymentVerification);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus) ;
router.route("/course/purchasedCourses").get(isAuthenticated,getAllPurchasedCourses);


export default router;