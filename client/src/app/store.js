import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi.js";
import { coursePurchaseApi } from "@/features/api/coursePurchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";
import { messageApi } from "@/features/api/messageApi.js";
import { superAdminApi } from "@/features/api/superAdminApi.js";



export const appStore = configureStore({
    reducer:rootReducer,
    middleware:(defaultMiddleWare)=>defaultMiddleWare().concat(
        authApi.middleware, 
        courseApi.middleware ,
        coursePurchaseApi.middleware ,
        courseProgressApi.middleware,
        messageApi.middleware,
        superAdminApi.middleware
    )
});


//whenever refresh data is not lost
const initializeApp= async ()=>{
        await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}

initializeApp();