import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const COURSE_API = "http://localhost:8080/api/v1/course";
export const courseApi = createApi({
    reducerPath: "courseApi",
    //tagTypes:['Refetch_Creator_Course'],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category }
            }),
            //invalidatesTags:['Refetch_Creator_Course']         //course is refetched
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
                method: "GET"
            }),
            //providesTags:['Refetch_Creator_Course']
        }),
        updateCourse :builder.mutation({
            query:({formData ,courseId})=>({
                url:`/${courseId}`,
                method:"PUT",
                body:formData
            })
        }),
        getCourseById:builder.query({
            query:(courseId)=>({
                url:`/${courseId}`,
                method:"GET"
            })
        }),
        getCourse:builder.query({
            query:(courseId)=>({
                url:`/course/details/${courseId}`,
                method:"GET"
            })
        }),
        createLecture:builder.mutation({
            query:({lectureTitle,courseId})=>({
                url:`/${courseId}/lecture`,
                method:"POST",
                body:{lectureTitle}
            })
        }),
        getCourseLecture:builder.query({
            query:(courseId)=>({
                url:`/${courseId}/lecture`,
                method:"GET"
            })
        }),
        editLecture:builder.mutation({
            query:({lectureTitle, videoInfo, courseId, lectureId, isPreviewFree})=>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:"POST",
                body:{lectureTitle,videoInfo,isPreviewFree}
            })
        }),
        removeLecture:builder.mutation({
            query:({    lectureId})=>({
                url:`/lecture/${lectureId}`,
                method:"DELETE",

            })
        }),
        getLectureById:builder.query({
            query:({lectureId})=>({
                url:`/lecture/${lectureId}`,
                method:"GET"
            })
        }),

        updateIsPublished:builder.mutation({
            query:({  courseId ,query})=>({
                url:`/${courseId}?publish=${query}`,    //this ? is query
                method:"PATCH"
            })
        }),

        removeCourse:builder.mutation({
            query:({courseId})=>({
                url:`/remove/${courseId}`,
                method:"DELETE"
            })
        }),

        getPublishedCourse:builder.query({
            query:()=>({
                url:"/published-courses",
                method:"GET"
            })
        }),

        getMyLearning:builder.query({
            query:()=>({
                url:"/my-learning",
                method:"GET"
            })
        })      ,

        getSearchedCourses:builder.query({
            query:({query,categories,sortByPrice})=>{
                //building query string
                let queryString=`/search?query=${encodeURIComponent(query)}`;

                if(categories && categories.length>0){
                    const categoriesString=categories.map(cat => `categories=${encodeURIComponent(cat)}`).join("&");
                queryString+=`&${categoriesString}`;
                }

                if(sortByPrice){
                    queryString+=`&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }
                return {
                    url:queryString,
                    method:"GET"
                }
            }
        })
    }),   
})


export const {
    useCreateCourseMutation ,
    useGetCreatorCourseQuery,
    useUpdateCourseMutation ,
    useGetCourseByIdQuery,
    useGetCourseQuery,
    useCreateLectureMutation ,
    useGetCourseLectureQuery ,
    useEditLectureMutation   ,
    useRemoveLectureMutation ,
    useGetLectureByIdQuery   ,
    useUpdateIsPublishedMutation ,
    useRemoveCourseMutation      ,
    useGetPublishedCourseQuery   ,
    useGetMyLearningQuery        ,
    useGetSearchedCoursesQuery   
} = courseApi;