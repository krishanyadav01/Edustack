import React, { useEffect } from 'react'
import { Button } from './ui/button'
import {usePaymentCheckoutMutation } from '@/features/api/coursePurchaseApi';

const BuyCourseButton = ({ course }) => {

  const [paymentCheckout, { data , isLoading, isSuccess, isError }] = usePaymentCheckoutMutation();

  const purchaseCourseHandler = async () => {
    //console.log(course._id)  ;
    await paymentCheckout({amount:course.coursePrice,courseId:course._id});
  }

  useEffect(() => {
    if (isSuccess && data) {
      //console.log(data.data.key);
      //console.log(keyData);
      //console.log(course._id)   ;
      const options = {
        key: data.data.key, // Now using actual key
        amount: data.data.order.amount,
        currency: "INR",
        name: course.creator.name,
        description: "Course Purchase",
        image: course.courseThumbnail,
        order_id: data.data.order.id,
        callback_url: "http://localhost:8080/api/v1/purchase/verification",
        prefill: {
          name: course.creator.name,
          email: course.creator.email,
          contact: "9000090000"
        },
        notes: {
          address: "Razorpay"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp1 = new window.Razorpay(options);            //razorpay is scripted in index.html   check window
      rzp1.open();
    }
  }, [isSuccess, data, course]);

  return (
    <Button onClick={purchaseCourseHandler} className="w-full">
      {isLoading ? "Processing..." : "Purchase Course"}
    </Button>
  )
}

export default BuyCourseButton
