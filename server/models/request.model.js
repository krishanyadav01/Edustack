import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resume:{
        type:String
    },
    education:{
        type:String
    } ,
    yoe:{
        type:String
    },
    status:{
        type:String,
        enum:["accepted","underreview","rejected"],
        default:"underreview"
    },
    rejectedMsg:{
        type:String
    }
}, { timestamps: true });

export const Request = mongoose.model("Request", requestSchema);