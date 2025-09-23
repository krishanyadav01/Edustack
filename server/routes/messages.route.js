import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createMessages, getCourseMessage } from "../controllers/messages.controller.js";


const router=express.Router();

router.route("/createMessage").post(isAuthenticated,createMessages);
router.route("/getMessage/:courseId").get(isAuthenticated,getCourseMessage);

export default router;