import {createApi, fetchBaseQuery, QueryStatus} from "@reduxjs/toolkit/query/react";


const SUPER_ADMIN_API="http://localhost:8080/api/v1/superadmin/"
export const superAdminApi=createApi({
    reducerPath:"superAdminApi",
    baseQuery:fetchBaseQuery({
        baseUrl:SUPER_ADMIN_API,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        getDashboardDetails:builder.query({         //mutation to post data and query to get data
            query:()=>({
                url:"getAllCourses",                 //register gets attached to USER_API at last
                method:"GET"
            })
        }),
        sendInstructorRequest:builder.mutation({
            query:({data})=>({
                url:"req/instructor",
                method:"POST",
                body:data
            })
        }),
        getPendingRequest:builder.query({
            query:()=>({
                url:"req/getPendingRequests",
                method:"GET"
            })
        }),
        getRequestStatus:builder.query({
            query:()=>({
                url:"req/getRequestStatus",
                method:"GET"
            })
        }),
        roleChange:builder.mutation({
            query:()=>({
                url:"req/roleChange",
                method:"POST"
            })
        }),
        getRequestById:builder.query({
            query:({reqId})=>({
                url:`req/getRequestById/${reqId}`,
                method:"GET"
            })
        }),
        rejectRequest:builder.mutation({
            query:({reqId,msg})=>({
                url:"req/reject",
                method:"POST",
                body:{reqId,msg}
            })
        }),
        acceptRequest:builder.mutation({
            query:({reqId})=>({
                url:"req/accept",
                method:"POST",
                body:{reqId}
            })
        }),
        deleteRequest:builder.mutation({
            query:()=>({
                url:"req/delete",
                method:"DELETE"
            })
        })
    })
});

export const {
    useGetDashboardDetailsQuery,
    useSendInstructorRequestMutation    ,
    useGetPendingRequestQuery,
    useGetRequestStatusQuery,
    useRoleChangeMutation   ,
    useGetRequestByIdQuery,
    useRejectRequestMutation  ,
    useAcceptRequestMutation  ,
    useDeleteRequestMutation  ,
}=superAdminApi;