import { instance } from "../index.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import crypto from "crypto";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";


export const checkout = async (req, res) => {

  try {
    const userId = req.id;
    const { courseId, amount } = req.body;
    const options = {
      amount: Number(amount * 100),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
    };

    if (!courseId) {
      return res.status(400).json({
        message: "Course Not  Found",
        success: false
      })
    }


    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount,
    })

    const order = await instance.orders.create(options)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Failed to load Payment Please try again later"
      })
    }

    newPurchase.paymentId = order.id;
    await newPurchase.save();

    //console.log(order);


    return res.status(200).json({
      success: true,
      data: {
        order,
        key: process.env.RAZORPAY_API_KEY
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error
    })
  }
}

export const paymentVerification = async (req, res) => {

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const verified = generated_signature === razorpay_signature;

    const purchase = await CoursePurchase.findOne({
      paymentId: razorpay_order_id
    }).populate({ path: "courseId"}).populate({path:"userId"})

    if (!verified) {
      purchase.status = "failed";
      purchase.save();
      return res.status(400).json({
        success: false,
        message: "Payment    Failed"
      })
    }

    purchase.status = "completed";




    //make all lectures visible my setting isPreview Free to true
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    await purchase.save();

    await User.findByIdAndUpdate(
      purchase.userId._id,
      { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Adding course ID to enrolledCourses
      { new: true }
    );



    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudent: purchase.userId._id } }, // Adding user ID to enrolledStudents
      { new: true }
    );



    return res.redirect(`${process.env.FRONTEND_URL}/course-details/${purchase.courseId._id}`);

    //console.log(purchase);
  
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error
    })
  }
}



export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course =await Course.findById(courseId).populate({ path: "creator" }).populate({ path: "lectures" });

    const purchased = await CoursePurchase.find({ userId, courseId });


    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      })
    }

    let purchasedStatus=false;              //if anyone transaction is completed stauts go to true
    purchased.forEach((purchase)=>{
      if(purchase.status==="completed"){
        purchasedStatus=true ;
      }
    })

    return res.status(200).json({
      course,
      purchased: purchasedStatus
    })


  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error
    })
  }
}



//this is for dashboard
export const getAllPurchasedCourses = async (req, res) => {
  try {

    const instructorId=req.id;
    const purchasedCourses = await CoursePurchase.find({ status: "completed" }).populate("courseId");

    //console.log(purchasedCourses);
    //console.log(purchasedCourses[0].courseId.creator._id.toString());
    //console.log(instructorId);


    const instructorSoldCourse=purchasedCourses.filter((purchase)=>purchase?.courseId?.creator._id.toString()===instructorId);

    //console.log(instructorPurchasedCourse);
    

    if (!instructorSoldCourse) {
      return res.status(404).json({
        instructorSoldCourse: []
      })
    }
    return res.status(200).json({
      instructorSoldCourse
    })

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error
    })
  }
}


