import {createApi, fetchBaseQuery, QueryStatus} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API="http://localhost:8080/api/v1/user/"
export const authApi=createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        registerUser:builder.mutation({         //mutation to post data and query to get data
            query:(inputData)=>({
                url:"register",                 //register gets attached to USER_API at last
                method:"POST",
                body:inputData
            })
        }),
        loginUser:builder.mutation({         //mutation to post data and query to get data
            query:(inputData)=>({
                url:"login",                 //login gets attached to USER_API at last
                method:"POST",
                body:inputData
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result =await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));           //this result is response sent by server
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        loadUser:builder.query({            //query for GET and mutation for POST
            query:()=>({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result =await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));    //restore the store with user and isauthenticated
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser:builder.mutation({
            query:(formData)=>({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:"include"
            })
        }),
        logoutUser:builder.mutation({
            query:()=>({
                url:"logout",
                method:"GET"
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    dispatch(userLoggedOut());                          //remove the user from the store
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        googleLoginUser:builder.mutation({
            query:({code})=>({
                url:`auth/login?code=${code}`,
                method:"POST"
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result =await queryFulfilled;
                    console.log(result);
                    dispatch(userLoggedIn({user:result.data.user}));           //this result is response sent by server
                } catch (error) {
                    console.log(error);
                }
            }
        })          
    })
});

export const {
    useRegisterUserMutation,   //hook
    useLoginUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    useLogoutUserMutation ,
    useGoogleLoginUserMutation
}=authApi;