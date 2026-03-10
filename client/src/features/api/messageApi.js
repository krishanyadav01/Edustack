import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const MESSAGE_API = "https://edustack-qkzh.onrender.com/api/v1/message";
export const  messageApi = createApi({
    reducerPath:  "messageApi",
    //tagTypes:['Refetch_Creator_Course'],
    baseQuery: fetchBaseQuery({
        baseUrl:  MESSAGE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createMessage: builder.mutation({
            query: ({courseId,userId,message}) => ({
                url: "/createMessage",
                method: "POST",
                body: {courseId,userId,message}
            })
        }),
        getCourseMessages:builder.query({
            query:({courseId})=>({
                url:`/getMessage/${courseId}`,
                method:"GET",
            })
        })
        }),
    })


export const {
    useCreateMessageMutation ,
    useGetCourseMessagesQuery
} =    messageApi;
