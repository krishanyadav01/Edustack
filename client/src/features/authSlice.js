import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
    isAuthenticated:false
}
const authSlice=createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        userLoggedIn:(state,action)=>{              //actions
            state.user=action.payload.user;
            state.isAuthenticated=true;
        },
        userLoggedOut:(state)=>{                  //nothing is passed here so no action
            state.user=null;
            state.isAuthenticated=false;
        }
    },
});

export const {userLoggedIn,userLoggedOut} =authSlice.actions;
export default authSlice.reducer;