import { createApi, fetchBaseQuery, QueryStatus } from "@reduxjs/toolkit/query/react";


const PROGRESS_API = "http://localhost:8080/api/v1/progress/"
export const courseProgressApi = createApi({
    reducerPath: "courseProgressApi",
    baseQuery: fetchBaseQuery({
        baseUrl: PROGRESS_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({

        getCourseProgress: builder.query({
            query: ({ courseId }) => ({
                url: `/${courseId}`,
                method: "GET"
            })
        }),

        updateLectureProgress: builder.mutation({
            query:({ courseId, lectureId })=> ({
                url: `/${courseId}/${lectureId}`,
                method:"POST"
            })
       }),

       markAsCompleted: builder.mutation({
        query: ({ courseId }) => ({
          url: `/${courseId}/complete`,   // Pass courseId as URL parameter
          method: "POST",
        }),
      }),

       markAsInComplete:builder.mutation({
        query:({courseId})=>({
            url:`/${courseId}/incomplete`,
            method:"POST"
        })
       })
        
    })
});

export const {
    useGetCourseProgressQuery ,
    useUpdateLectureProgressMutation  ,
    useMarkAsCompletedMutation        ,
    useMarkAsInCompleteMutation      
} = courseProgressApi;