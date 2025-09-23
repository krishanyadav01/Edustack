import {createApi, fetchBaseQuery, QueryStatus} from "@reduxjs/toolkit/query/react";


const PURCHASE_API="http://localhost:8080/api/v1/purchase/"
export const coursePurchaseApi=createApi({
    reducerPath:"coursePurchaseApi",
    baseQuery:fetchBaseQuery({
        baseUrl:PURCHASE_API,
        credentials:"include"
    }),
    endpoints:(builder)=>({

        paymentCheckout:builder.mutation({         
            query:({ amount,courseId})=>({
                url:"checkout",                 
                method:"POST",
                body:{amount,courseId}
            })
        }),

        getCourseDetailsWithPurchaseStatus:builder.query({
            query:({courseId})=>({
                url:`course/${courseId}/detail-with-status`,                 
                method:"GET",
            })
        }),
        
        getInstructorPurchasedCourses:builder.query({
            query:()=>({
                url:"/course/purchasedCourses",
                method:"GET"
            })
        })
    })
});

export const {
    usePaymentCheckoutMutation   ,
    useGetCourseDetailsWithPurchaseStatusQuery   ,
    useGetInstructorPurchasedCoursesQuery
}= coursePurchaseApi;