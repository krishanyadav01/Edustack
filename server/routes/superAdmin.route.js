import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { acceptRequest, createReq, deleteRequest, getPendingRequests, getRequestById, getRequestStatus, getSuperAdminDashboard, rejectRequest, roleChange } from "../controllers/superAdmin.controller.js";
import upload from "../utils/multer.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.js";

const router=express.Router();


// we will change this isAuthenticated to isSuperAdmin to protect our routes
router.route("/getAllCourses").get(isSuperAdmin,getSuperAdminDashboard);
router.route("/req/instructor").post(isAuthenticated,upload.single("resume"),createReq);
router.route("/req/getPendingRequests").get(isSuperAdmin,getPendingRequests)                       ;
router.route("/req/getRequestStatus").get(isAuthenticated,getRequestStatus)                           ;
router.route("/req/roleChange").post(isAuthenticated,roleChange);
router.route("/req/getRequestById/:reqId").get(isSuperAdmin,getRequestById) ;    
router.route("/req/reject").post(isSuperAdmin,rejectRequest);
router.route("/req/accept").post(isSuperAdmin,acceptRequest);
router.route("/req/delete").delete(isAuthenticated,deleteRequest)

export default router;