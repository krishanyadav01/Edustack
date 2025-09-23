import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:function(){
            return !this.googleId;      //password required  only when not Google User
        }
    },
    googleId:{
        type:String,
        default:null
    }
    ,
    role:{
        type:String,
        enum:["instructor","student","superadmin"],
        default:"student"
    },
    //courses can be many therfore array
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course'
        }
    ],
    photoUrl:{
        type:String,
        default:""
    },
    chatAccess:{
        type:String,
        enum:["ban","unban"],
        default:"unban"
    }
},{timestamps:true})

export const User=mongoose.model("User",userSchema);